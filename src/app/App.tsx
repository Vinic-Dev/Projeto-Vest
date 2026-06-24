import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard, BookOpen, FlaskConical, Globe, Calculator,
  BarChart3, Clock, Target, Search, ChevronDown, ChevronRight,
  Star, X, Menu, TrendingUp, Calendar, Zap, Award,
  Plus, AlertCircle, RotateCcw, Flame, Check, GraduationCap, Brain,
  LogOut, Settings
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";
import { supabase, signOut, onAuthStateChange, getUserProfile } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import LoginPage from "./components/LoginPage";
import ManageAreasPage from "./components/ManageAreasPage";
import ActiveSessionTimer from "./components/ActiveSessionTimer";
import SchedulePage from "./components/SchedulePage";

// ─── Types ────────────────────────────────────────────────────────────────────
import type { Status, Page, Subtopic, Topic, Area, Session, ScheduleEvent } from "./types";
import { STATUS_CFG, STATUS_CYCLE, DAYS_TO_VEST } from "./constants";
import { INITIAL_AREAS } from "./data";

const TODAY = new Date();
const todayStr = TODAY.toISOString().split("T")[0];
const dStr = (offset: number) => new Date(TODAY.getTime() + offset * 86400000).toISOString().split("T")[0];

const formatDateBr = (d: string) => {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const INITIAL_SESSIONS: Session[] = [];

// ─── Calc helpers ─────────────────────────────────────────────────────────────
function calcProgress(area: Area): number {
  const all = area.topics.flatMap(t => t.subtopics);
  if (!all.length) return 0;
  const scored = all.reduce((acc, s) => {
    if (s.status === "mastered") return acc + 1;
    if (s.status === "practicing") return acc + 0.6;
    if (s.status === "learning") return acc + 0.3;
    if (s.status === "revision_needed") return acc + 0.35;
    return acc;
  }, 0);
  return Math.round((scored / all.length) * 100);
}

function calcStreak(sessions: Session[]): number {
  const studyDays = new Set(sessions.map(s => s.date));
  let streak = 0;
  let cursor = new Date(TODAY);
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (studyDays.has(key)) { streak++; cursor = new Date(cursor.getTime() - 86400000); }
    else break;
  }
  return streak;
}

function getUpcomingReviews(areas: Area[]) {
  const results: Array<Subtopic & { areaName: string; areaColor: string; daysLeft: number }> = [];
  for (const area of areas) {
    for (const topic of area.topics) {
      for (const s of topic.subtopics) {
        if (s.nextReview) {
          const daysLeft = Math.ceil((new Date(s.nextReview).getTime() - new Date(todayStr).getTime()) / 86400000);
          if (daysLeft <= 3) results.push({ ...s, areaName: area.name, areaColor: area.color, daysLeft });
        }
      }
    }
  }
  return results.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 8);
}

function getWeakTopics(areas: Area[]) {
  const results: Array<Subtopic & { areaName: string; areaColor: string; topicName: string }> = [];
  for (const area of areas) {
    for (const topic of area.topics) {
      for (const s of topic.subtopics) {
        if (s.mastery <= 2 && s.status !== "not_started") {
          results.push({ ...s, areaName: area.name, areaColor: area.color, topicName: topic.name });
        }
      }
    }
  }
  return results.sort((a, b) => a.mastery - b.mastery).slice(0, 8);
}

// ─── Small components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

function MasteryStars({ score, onChange }: { score: number; onChange?: (n: number) => void }) {
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
  const activeColor = score >= 1 ? colors[score] : "#374151";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange?.(n)}
          className={`transition-transform ${onChange ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}>
          <Star className="w-3 h-3"
            fill={n <= score ? activeColor : "transparent"}
            stroke={n <= score ? activeColor : "#2a3552"}
            strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

function ProgressBar({ value, color = "#34d399", height = 5 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: "rgba(255,255,255,0.06)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "#34d399" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-xl font-semibold text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Search Modal ─────────────────────────────────────────────────────────────
function SearchModal({ areas, onClose, onSelectArea }: {
  areas: Area[]; onClose: () => void; onSelectArea: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    const out: Array<{ type: "topic" | "subtopic"; areaId: string; areaName: string; areaColor: string; name: string; extra?: string; status?: Status }> = [];
    for (const area of areas) {
      for (const topic of area.topics) {
        if (topic.name.toLowerCase().includes(lq))
          out.push({ type: "topic", areaId: area.id, areaName: area.name, areaColor: area.color, name: topic.name });
        for (const s of topic.subtopics) {
          if (s.name.toLowerCase().includes(lq))
            out.push({ type: "subtopic", areaId: area.id, areaName: area.name, areaColor: area.color, name: s.name, extra: topic.name, status: s.status });
        }
      }
    }
    return out.slice(0, 10);
  }, [q, areas]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
      onClick={onClose}>
      <div className="w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input ref={inputRef} type="text" placeholder="Buscar tópicos e subtópicos..."
            value={q} onChange={e => setQ(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <button key={i} onClick={() => { onSelectArea(r.areaId); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.areaColor }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {r.areaName}{r.extra ? ` › ${r.extra}` : ""}
                  </div>
                </div>
                {r.status && <StatusBadge status={r.status} />}
              </button>
            ))}
          </div>
        )}
        {q && results.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum resultado para &ldquo;{q}&rdquo;
          </div>
        )}
        {!q && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Digite para buscar qualquer conteúdo do vestibular
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const AREA_ICONS: Record<string, React.ElementType> = {
  mat: Calculator, lin: BookOpen, nat: FlaskConical, hum: Globe,
};

function Sidebar({ page, selectedAreaId, areas, sessions, onNavigate, onSelectArea, collapsed, onToggle, userName, onLogout }: {
  page: Page; selectedAreaId: string | null; areas: Area[]; sessions: Session[];
  onNavigate: (p: Page) => void; onSelectArea: (id: string) => void;
  collapsed: boolean; onToggle: () => void;
  userName: string; onLogout: () => void;
}) {
  const navItem = (p: Page, Icon: React.ElementType, label: string) => {
    const active = page === p && !selectedAreaId;
    return (
      <button key={p} onClick={() => { onNavigate(p); onSelectArea(""); }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
        <Icon className="w-4 h-4 flex-shrink-0" />
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={onToggle} />
      )}
      <aside className={`fixed md:relative z-50 h-full flex-shrink-0 flex flex-col border-r border-border bg-sidebar transition-transform md:transition-all duration-300 ${collapsed ? "-translate-x-full md:translate-x-0 md:w-14" : "translate-x-0 w-64 md:w-56"}`}>
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#34d399,#60a5fa)" }}>
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground leading-none">Study Vestibular</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">{DAYS_TO_VEST}d para o vestibular</div>
          </div>
        )}
        <button onClick={onToggle} className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 hidden md:block">
          <Menu className="w-3.5 h-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItem("dashboard", LayoutDashboard, "Dashboard")}

        {!collapsed && <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 pt-3 pb-1">Matérias</div>}

        {areas.map(area => {
          const Icon = AREA_ICONS[area.id] || BookOpen;
          const active = selectedAreaId === area.id;
          const pct = calcProgress(area);
          return (
            <button key={area.id} onClick={() => { onSelectArea(area.id); onNavigate("area"); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              style={active ? { background: `${area.color}15` } : {}}>
              <Icon className="w-4 h-4 flex-shrink-0" style={active ? { color: area.color } : {}} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{area.short}</span>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: area.color, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
                </>
              )}
            </button>
          );
        })}

        <div className="mt-4 border-t border-border pt-4">
          {navItem("schedule", Calendar, "Cronograma")}
          {navItem("manage", Settings, "Gerenciar Matérias")}
        </div>

      </nav>

      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/5">
            <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground">{calcStreak(sessions)} dias seguidos</div>
              <div className="text-[10px] text-muted-foreground">Sequência de estudos</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg border border-border text-left transition-all text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold leading-tight truncate">{userName}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Sair</div>
            </div>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ areas, sessions, onSelectArea, onNavigate, userName, onAddSession }: {
  areas: Area[]; sessions: Session[];
  onSelectArea: (id: string) => void; onNavigate: (p: Page) => void;
  userName: string; onAddSession: (s: Session) => void;
}) {
  const radarData = areas.map(a => ({ area: a.short, value: calcProgress(a), color: a.color }));
  const totalMinutes = sessions.reduce((a, s) => a + s.duration, 0);

  const weeklyData = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const map: Record<string, number> = {};
    sessions.forEach(s => {
      const day = days[new Date(s.date).getDay()];
      map[day] = (map[day] || 0) + s.duration;
    });
    return days.map(d => ({ day: d, minutos: Math.round((map[d] || 0) / 60 * 10) / 10 }));
  }, [sessions]);

  const upcoming = getUpcomingReviews(areas);
  const allSubs = areas.flatMap(a => a.topics.flatMap(t => t.subtopics));
  const masteredCount = allSubs.filter(s => s.status === "mastered").length;


  return (
    <div className="p-6 sm:p-8 space-y-10 w-full max-w-[2000px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Bem-vindo(a) de volta</div>
          <h1 className="text-2xl font-semibold text-foreground">{userName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-primary font-medium">{DAYS_TO_VEST}</span> dias para o vestibular · Você está no caminho certo!
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-foreground">{calcStreak(sessions)} dias</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-foreground">{masteredCount} dominados</span>
          </div>
        </div>
      </div>

      {/* Area Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {areas.map(area => {
          const pct = calcProgress(area);
          const subtopics = area.topics.flatMap(t => t.subtopics);
          const mastered = subtopics.filter(s => s.status === "mastered").length;
          const Icon = AREA_ICONS[area.id] || BookOpen;
          return (
            <button key={area.id} onClick={() => { onSelectArea(area.id); onNavigate("area"); }}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-white/15 transition-all hover:-translate-y-0.5 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${area.color}1a` }}>
                  <Icon className="w-4 h-4" style={{ color: area.color }} />
                </div>
                <span className="text-lg font-bold" style={{ color: area.color, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
              <div className="text-sm font-medium text-foreground mb-0.5 truncate">{area.short}</div>
              <div className="text-[11px] text-muted-foreground mb-2">{mastered}/{subtopics.length} dominados</div>
              <ProgressBar value={pct} color={area.color} />
            </button>
          );
        })}
      </div>


      <ActiveSessionTimer areas={areas} onSaveSession={onAddSession} />
      
      <AnalyticsSection areas={areas} sessions={sessions} />
      <SessionsSection areas={areas} sessions={sessions} />
    </div>
  );
}

// ─── Area Page ────────────────────────────────────────────────────────────────
function AreaPage({ area, onUpdate }: {
  area: Area;
  onUpdate: (areaId: string, subId: string, changes: Partial<Subtopic>) => void;
}) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const pct = calcProgress(area);
  const allSubs = area.topics.flatMap(t => t.subtopics);
  const mastered = allSubs.filter(s => s.status === "mastered").length;
  const Icon = AREA_ICONS[area.id] || BookOpen;

  const cycleStatus = (sub: Subtopic) => {
    const idx = STATUS_CYCLE.indexOf(sub.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onUpdate(area.id, sub.id, { status: next });
  };

  const statusCount = (status: Status) => allSubs.filter(s => s.status === status).length;

  const selectedTopic = area.topics.find(t => t.id === selectedTopicId);

  return (
    <div className="p-6 sm:p-8 space-y-10 w-full max-w-[2000px] mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${area.color}1a` }}>
          <Icon className="w-6 h-6" style={{ color: area.color }} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{area.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-muted-foreground">
            {(["mastered", "practicing", "learning", "revision_needed", "not_started"] as Status[]).map(st => (
              <span key={st} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: STATUS_CFG[st].color }} />
                {statusCount(st)} {STATUS_CFG[st].label.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: area.color, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</div>
          <div className="text-xs text-muted-foreground mt-0.5">{mastered}/{allSubs.length} dominados</div>
        </div>
      </div>
      <ProgressBar value={pct} color={area.color} height={6} />

      {/* Books Section */}
      <div className="mt-8 mb-4">
        <h2 className="text-xs font-bold text-muted-foreground/80 mb-4 uppercase tracking-widest">Materiais Didáticos</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {area.topics.map(topic => (
            <a key={topic.id} href={`livros/${encodeURIComponent(topic.name)}.pdf`} target="_blank" rel="noopener noreferrer" 
               className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all w-36 flex-shrink-0 group shadow-sm snap-start">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-center text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-3">
                {topic.name}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Grid of Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {area.topics.map(topic => {
          const topicPct = (() => {
            const s = topic.subtopics;
            if (!s.length) return 0;
            const scored = s.reduce((acc, x) => {
              if (x.status === "mastered") return acc + 1;
              if (x.status === "practicing") return acc + 0.6;
              if (x.status === "learning") return acc + 0.3;
              return acc;
            }, 0);
            return Math.round((scored / s.length) * 100);
          })();

          return (
            <button key={topic.id} onClick={() => setSelectedTopicId(topic.id)}
              className="bg-card border border-border rounded-2xl p-6 text-left hover:-translate-y-1 hover:border-primary/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-xl font-bold" style={{ color: area.color, fontFamily: "'JetBrains Mono', monospace" }}>{topicPct}%</div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">{topic.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{topic.subtopics.length} subtópicos</p>
              
              <div className="w-full mt-auto">
                <div className="flex justify-between text-[11px] mb-1.5 text-muted-foreground">
                  <span>Progresso</span>
                  <span style={{ color: area.color }}>{topic.subtopics.filter(s => s.status === "mastered").length} dominados</span>
                </div>
                <ProgressBar value={topicPct} color={area.color} height={6} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Pop-up Modal for Subtopics */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedTopicId(null)}>
          <div className="bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedTopic.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTopic.subtopics.length} subtópicos para estudar</p>
                </div>
                
                {/* Book Link */}
                <a href={`livros/${encodeURIComponent(selectedTopic.name)}.pdf`} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-4 p-3 pr-6 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-max group shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Livro de {selectedTopic.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Abrir PDF do material</div>
                  </div>
                </a>
              </div>
              <button onClick={() => setSelectedTopicId(null)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border sticky top-0 bg-card z-10">
                <span>Subtópico</span>
                <span>Status</span>
                <span>Domínio</span>
                <span className="hidden md:block">Próx. revisão</span>
              </div>
              <div className="divide-y divide-border">
                {selectedTopic.subtopics.map(s => (
                  <div key={s.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center px-4 py-4 hover:bg-white/3 transition-colors">
                    <div className="text-sm font-medium text-foreground pr-2">{s.name}</div>
                    <button onClick={() => cycleStatus(s)} title="Clique para alterar o status">
                      <StatusBadge status={s.status} />
                    </button>
                    <MasteryStars score={s.mastery}
                      onChange={n => onUpdate(area.id, s.id, { mastery: n })} />
                    <div className="hidden md:block text-xs font-medium text-muted-foreground text-right w-20"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {s.nextReview ? formatDateBr(s.nextReview) : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────
function StudyHeatmap({ sessions }: { sessions: Session[] }) {
  const cells = useMemo(() => {
    const map = new Map<string, number>();
    sessions.forEach(s => map.set(s.date, (map.get(s.date) || 0) + s.duration));
    const result: Array<{ date: string; minutes: number } | null> = [];
    for (let i = 90; i >= 0; i--) {
      const dt = new Date(TODAY.getTime() - i * 86400000);
      const key = dt.toISOString().split("T")[0];
      result.push({ date: key, minutes: map.get(key) || 0 });
    }
    const firstDay = new Date(TODAY.getTime() - 90 * 86400000).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return [...Array(offset).fill(null), ...result];
  }, [sessions]);

  const weeks: Array<Array<{ date: string; minutes: number } | null>> = [];
  for (let i = 0; i < Math.ceil(cells.length / 7); i++) {
    weeks.push(cells.slice(i * 7, (i + 1) * 7));
  }

  const getColor = (m: number) => {
    if (m === 0) return "rgba(255,255,255,0.04)";
    if (m <= 45) return "rgba(52,211,153,0.25)";
    if (m <= 90) return "rgba(52,211,153,0.5)";
    if (m <= 150) return "rgba(52,211,153,0.75)";
    return "#34d399";
  };

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((cell, di) => (
            <div key={di} className="w-3 h-3 rounded-sm"
              style={{ background: cell ? getColor(cell.minutes) : "transparent" }}
              title={cell ? `${formatDateBr(cell.date)}: ${cell.minutes}min` : ""} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsSection({ areas, sessions }: { areas: Area[]; sessions: Session[] }) {
  const totalMinutes = sessions.reduce((a, s) => a + s.duration, 0);
  const allSubs = areas.flatMap(a => a.topics.flatMap(t => t.subtopics));
  const masteredCount = allSubs.filter(s => s.status === "mastered").length;
  const studyDays = new Set(sessions.map(s => s.date)).size;
  const avgMastery = (allSubs.filter(s => s.mastery > 1).reduce((a, s) => a + s.mastery, 0) / allSubs.filter(s => s.mastery > 1).length).toFixed(1);

  const areaBarData = areas.map(a => ({
    name: a.short,
    progress: calcProgress(a),
    color: a.color,
  }));

  const weakTopics = getWeakTopics(areas);

  const statusData = [
    { name: "Dominado", value: allSubs.filter(s => s.status === "mastered").length, color: "#34d399" },
    { name: "Praticando", value: allSubs.filter(s => s.status === "practicing").length, color: "#fbbf24" },
    { name: "Aprendendo", value: allSubs.filter(s => s.status === "learning").length, color: "#60a5fa" },
    { name: "Revisar", value: allSubs.filter(s => s.status === "revision_needed").length, color: "#f87171" },
    { name: "Não iniciado", value: allSubs.filter(s => s.status === "not_started").length, color: "#374151" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mt-4 border-t border-border pt-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Desempenho</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Clock} label="Horas estudadas" value={`${(totalMinutes / 60).toFixed(0)}h`} sub="últimos 30 dias" color="#60a5fa" />
        <StatCard icon={Calendar} label="Dias de estudo" value={`${studyDays}`} sub="últimos 30 dias" color="#a78bfa" />
        <StatCard icon={Award} label="Subtópicos dominados" value={`${masteredCount}`} sub={`de ${allSubs.length} total`} color="#34d399" />
        <StatCard icon={TrendingUp} label="Domínio médio" value={`${avgMastery}/5`} sub="subtópicos estudados" color="#fbbf24" />
      </div>

      {/* Heatmap */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-foreground">Atividade de Estudo (90 dias)</div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Menos</span>
            {[0, 45, 90, 150, 200].map((m, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: m === 0 ? "rgba(255,255,255,0.04)" : m <= 45 ? "rgba(52,211,153,0.25)" : m <= 90 ? "rgba(52,211,153,0.5)" : m <= 150 ? "rgba(52,211,153,0.75)" : "#34d399" }} />
            ))}
            <span>Mais</span>
          </div>
        </div>
        <StudyHeatmap sessions={sessions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Area progress bar chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium text-foreground mb-4">Progresso por Área</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={areaBarData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7a94", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#1a1e2e", fontSize: 12, fontFamily: "Lexend" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#1a1e2e" }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="progress" name="Progresso" radius={[0, 4, 4, 0]}>
                {areaBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium text-foreground mb-4">Distribuição por Status</div>
          <div className="space-y-3">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-24 text-xs text-muted-foreground">{item.name}</div>
                <div className="flex-1">
                  <div className="h-5 rounded-md overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full rounded-md transition-all duration-700"
                      style={{ width: `${(item.value / allSubs.length) * 100}%`, background: item.color + "99" }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right tabular-nums"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak topics */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <div className="text-sm font-medium text-foreground">Tópicos que precisam de atenção</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopics.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-white/2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.areaColor }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground truncate">{item.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{item.areaName} › {item.topicName}</div>
              </div>
              <MasteryStars score={item.mastery} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sessions Section ────────────────────────────────────────────────────────────
function SessionsSection({ areas, sessions }: {
  areas: Area[]; sessions: Session[];
}) {
  const totalMinutes = sessions.reduce((a, s) => a + s.duration, 0);

  return (
    <div className="space-y-5 w-full mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Sessões de Estudo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sessions.length} sessões · {(totalMinutes / 60).toFixed(0)}h totais
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest border-b border-border">
          <span className="w-3" />
          <span>Tópico / Área</span>
          <span className="hidden sm:block">Data</span>
          <span>Duração</span>
        </div>
        <div className="divide-y divide-border">
          {sessions.map(s => {
            const area = areas.find(a => a.id === s.areaId);
            return (
              <div key={s.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-4 py-3 hover:bg-white/3 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: area?.color }} />
                <div className="min-w-0">
                  <div className="text-sm text-foreground truncate">{s.topicName}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{area?.name}{s.notes ? ` · ${s.notes}` : ""}</div>
                </div>
                <div className="hidden sm:block text-[11px] text-muted-foreground whitespace-nowrap"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatDateBr(s.date)}</div>
                <div className="text-xs font-medium text-muted-foreground whitespace-nowrap"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.duration}min</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar({ page, selectedArea, onSearch, userInitials, onToggleSidebar }: {
  page: Page; selectedArea: Area | null; onSearch: () => void; userInitials: string;
  onToggleSidebar?: () => void;
}) {
  const titles: Record<Page, string> = {
    dashboard: "Dashboard", area: selectedArea?.name || "", manage: "Gerenciar Matérias", schedule: "Cronograma"
  };

  return (
    <header className="h-14 flex-shrink-0 border-b border-border flex items-center gap-4 px-5">
      <div className="flex-1 flex items-center gap-2">
        <button onClick={onToggleSidebar} className="md:hidden mr-1 text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        {selectedArea && (
          <div className="w-2 h-2 rounded-full" style={{ background: selectedArea.color }} />
        )}
        <h2 className="text-sm font-medium text-foreground">{titles[page]}</h2>
      </div>

      <button onClick={onSearch}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Buscar conteúdo...</span>
        <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/3 text-xs text-muted-foreground">
        <Zap className="w-3.5 h-3.5 text-yellow-400" />
        <span className="hidden sm:inline">{DAYS_TO_VEST}d para o vestibular</span>
      </div>

      <a href="cart_o_animado_eu_te_amo.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-500 border border-pink-500/30 text-xs font-bold hover:bg-pink-500/30 transition-colors">
        Surpresa 🎁
      </a>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-white/10 flex items-center justify-center text-xs font-semibold text-foreground">
        {userInitials}
      </div>
    </header>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ─── Auth State ────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  // ─── App State ─────────────────────────────────────────────
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // ─── Derived ───────────────────────────────────────────────
  const userInitials = useMemo(() => {
    if (!userName) return "?";
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }, [userName]);

  // ─── Auth Listener ─────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        // Try profile table first, then user_metadata
        const profile = await getUserProfile(authUser.id);
        setUserName(profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Estudante");
        if (profile?.custom_areas) {
          setAreas(profile.custom_areas);
        } else {
          setAreas(INITIAL_AREAS);
        }
        if (profile?.schedule) {
          setScheduleEvents(profile.schedule);
        } else {
          setScheduleEvents([]);
        }
      } else {
        setUserName("");
        setAreas(INITIAL_AREAS);
        setScheduleEvents([]);
      }
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSaveAreasConfig = async (newAreas: Area[]) => {
    setAreas(newAreas);
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ custom_areas: newAreas })
        .eq('id', user.id);
      if (error) throw error;
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar configuração de matérias:", err);
      alert("Erro ao salvar as configurações no banco de dados.");
    }
  };

  const handleSaveSchedule = async (newEvents: ScheduleEvent[]) => {
    setScheduleEvents(newEvents);
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ schedule: newEvents })
        .eq('id', user.id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao salvar cronograma:", err);
      alert("Erro ao salvar o cronograma no banco de dados.");
    }
  };

  // ─── Sync Data from Supabase (user-scoped) ─────────────────
  const syncDataFromSupabase = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Fetch progress for this user
      const { data: progressData, error: progressError } = await supabase
        .from("subtopic_progress")
        .select("*")
        .eq("user_id", user.id);

      if (progressError) throw progressError;

      if (progressData && progressData.length > 0) {
        const progressMap = new Map(progressData.map(p => [p.subtopic_id, p]));
        setAreas(prev => prev.map(area => ({
          ...area,
          topics: area.topics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(subtopic => {
              const saved = progressMap.get(subtopic.id);
              if (saved) {
                return {
                  ...subtopic,
                  status: saved.status as Status,
                  mastery: saved.mastery,
                  lastReview: saved.last_review,
                  nextReview: saved.next_review,
                };
              }
              return subtopic;
            }),
          })),
        })));
      }

      // 2. Fetch sessions for this user
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionsError) throw sessionsError;

      if (sessionsData && sessionsData.length > 0) {
        setSessions(sessionsData.map((s: any) => ({
          id: s.id,
          date: s.date,
          duration: s.duration,
          areaId: s.area_id,
          topicName: s.topic_name,
          notes: s.notes || "",
        })));
      } else {
        // New user — start with empty sessions
        setSessions([]);
      }
    } catch (err) {
      console.error("Erro ao sincronizar com o Supabase:", err);
    }
  }, [user]);

  // Sync when user changes (login)
  useEffect(() => {
    if (user) {
      syncDataFromSupabase();
    }
  }, [user, syncDataFromSupabase]);

  // Cmd+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const selectedArea = areas.find(a => a.id === selectedAreaId) || null;

  const handleUpdate = (areaId: string, subId: string, changes: Partial<Subtopic>) => {
    setAreas(prev => prev.map(area => {
      if (area.id !== areaId) return area;
      return {
        ...area,
        topics: area.topics.map(topic => ({
          ...topic,
          subtopics: topic.subtopics.map(s => {
            if (s.id === subId) {
              const updated = { ...s, ...changes };

              // Sync to Supabase in the background
              if (user) {
                supabase.from("subtopic_progress").upsert({
                  user_id: user.id,
                  subtopic_id: subId,
                  status: updated.status,
                  mastery: updated.mastery,
                  last_review: updated.lastReview,
                  next_review: updated.nextReview,
                }, { onConflict: "user_id,subtopic_id" }).then(({ error }) => {
                  if (error) console.error("Erro ao salvar progresso no Supabase:", error);
                });
              }
              return updated;
            }
            return s;
          }),
        })),
      };
    }));
  };

  const handleAddSession = async (newSession: Session) => {
    setSessions(prev => [newSession, ...prev]);

    // Sync to Supabase in the background
    if (user) {
      try {
        const { error } = await supabase.from("study_sessions").insert({
          id: newSession.id,
          user_id: user.id,
          date: newSession.date,
          duration: newSession.duration,
          area_id: newSession.areaId,
          topic_name: newSession.topicName,
          notes: newSession.notes,
        });
        if (error) throw error;
      } catch (error) {
        console.error("Erro ao salvar sessão no Supabase:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Reset to defaults
      setAreas(INITIAL_AREAS);
      setSessions(INITIAL_SESSIONS);
      setPage("dashboard");
      setSelectedAreaId("");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleSelectArea = (id: string) => {
    setSelectedAreaId(id);
    if (id) setPage("area");
  };

  const handleNavigate = (p: Page) => {
    setPage(p);
    if (p !== "area") setSelectedAreaId("");
  };

  // ─── Loading State ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#34d399,#60a5fa)" }}>
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ─── Login Gate ─────────────────────────────────────────────
  if (!user) {
    return <LoginPage onAuth={() => {}} />;
  }

  // ─── Authenticated App ─────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        page={page}
        selectedAreaId={selectedAreaId}
        areas={areas}
        sessions={sessions}
        onNavigate={handleNavigate}
        onSelectArea={handleSelectArea}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar page={page} selectedArea={selectedArea} onSearch={() => setSearchOpen(true)} userInitials={userInitials} onToggleSidebar={() => setSidebarCollapsed(v => !v)} />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && (
            <DashboardPage areas={areas} sessions={sessions} onSelectArea={handleSelectArea} onNavigate={handleNavigate} userName={userName} onAddSession={handleAddSession} />
          )}
          {page === "area" && selectedArea && (
            <AreaPage area={selectedArea} onUpdate={handleUpdate} />
          )}
          {page === "manage" && (
            <ManageAreasPage areas={areas} onSave={handleSaveAreasConfig} />
          )}
          {page === "schedule" && (
            <SchedulePage areas={areas} events={scheduleEvents} onSave={handleSaveSchedule} />
          )}
        </main>
      </div>

      {searchOpen && (
        <SearchModal areas={areas} onClose={() => setSearchOpen(false)} onSelectArea={handleSelectArea} />
      )}
    </div>
  );
}
