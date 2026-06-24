import React, { useState, useMemo } from "react";
import { Area, ScheduleEvent } from "../types";
import { Calendar as CalendarIcon, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// --- Date Math Helpers ---
const TODAY = new Date();
const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfWeek = (d: Date) => {
  const c = new Date(d);
  c.setDate(c.getDate() - c.getDay());
  return c;
};
const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DAYS_SHORT = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23

export default function SchedulePage({ areas, events, onSave }: {
  areas: Area[];
  events: ScheduleEvent[];
  onSave: (events: ScheduleEvent[]) => void;
}) {
  const [baseDate, setBaseDate] = useState<Date>(TODAY);
  const [view, setView] = useState<"semana" | "mes">("semana");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; hour?: number } | null>(null);
  
  const [form, setForm] = useState({ areaId: areas[0]?.id || "", subtopicId: "", duration: 1 });
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const activeArea = areas.find(a => a.id === form.areaId);
  const allSubtopics = activeArea ? activeArea.topics.flatMap(t => t.subtopics) : [];

  React.useEffect(() => {
    if (activeArea && (!form.subtopicId || !allSubtopics.find(s => s.id === form.subtopicId))) {
      setForm(f => ({ ...f, subtopicId: allSubtopics[0]?.id || "" }));
    }
  }, [form.areaId, activeArea, allSubtopics]);

  const weekStart = startOfWeek(baseDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = addDays(startOfWeek(monthEnd), 6);
  const monthDays: Date[] = [];
  let cur = calendarStart;
  while (cur <= calendarEnd) {
    monthDays.push(cur);
    cur = addDays(cur, 1);
  }

  const handleNav = (dir: -1 | 1) => {
    if (view === "semana") setBaseDate(addDays(baseDate, dir * 7));
    else setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + dir, 1));
  };
  const handleToday = () => setBaseDate(TODAY);

  const handleCellClick = (dateStr: string, hour?: number) => {
    if (hour !== undefined) {
      const existing = events.find(e => e.date === dateStr && hour >= e.startHour && hour < e.startHour + e.durationHours);
      if (existing) {
        setEditingEvent(existing);
        setForm({ areaId: existing.areaId, subtopicId: existing.subtopicId || "", duration: existing.durationHours });
        setSelectedSlot(null);
        setModalOpen(true);
      } else {
        setSelectedSlot({ date: dateStr, hour });
        setEditingEvent(null);
        setForm({ areaId: areas[0]?.id || "", subtopicId: "", duration: 1 });
        setModalOpen(true);
      }
    } else {
      setSelectedSlot({ date: dateStr, hour: 6 });
      setEditingEvent(null);
      setForm({ areaId: areas[0]?.id || "", subtopicId: "", duration: 1 });
      setModalOpen(true);
    }
  };

  const handleEventClick = (e: React.MouseEvent, evt: ScheduleEvent) => {
    e.stopPropagation();
    setEditingEvent(evt);
    setForm({ areaId: evt.areaId, subtopicId: evt.subtopicId || "", duration: evt.durationHours });
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.areaId) return;

    if (editingEvent) {
      const updated = events.map(e => e.id === editingEvent.id ? { ...e, areaId: form.areaId, subtopicId: form.subtopicId, durationHours: form.duration } : e);
      onSave(updated);
    } else if (selectedSlot) {
      const startH = selectedSlot.hour || 6;
      const hasCollision = events.some(e => 
        e.date === selectedSlot.date &&
        startH < e.startHour + e.durationHours && 
        startH + form.duration > e.startHour
      );
      if (hasCollision) {
        alert("Já existe uma matéria neste horário!");
        return;
      }

      const newEvent: ScheduleEvent = {
        id: `evt_${Date.now()}`,
        date: selectedSlot.date,
        startHour: startH,
        durationHours: form.duration,
        areaId: form.areaId,
        subtopicId: form.subtopicId,
      };
      onSave([...events, newEvent]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      onSave(events.filter(e => e.id !== editingEvent.id));
      setModalOpen(false);
    }
  };

  const renderWeekView = () => (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto select-none mt-6">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/30">
          <div className="p-3"></div>
          {weekDays.map((d, i) => (
            <div key={i} className="p-3 text-center text-sm font-semibold text-foreground border-l border-border flex flex-col items-center">
              <span>{DAYS_SHORT[d.getDay()]}</span>
              <span className={`text-lg mt-0.5 ${ymd(d) === ymd(TODAY) ? 'text-primary' : 'text-muted-foreground'}`}>{d.getDate()}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          {HOURS.map(h => (
            <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50">
              <div className="py-2 px-1 text-xs font-medium text-muted-foreground text-right border-r border-border">
                {h.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((d, dayIndex) => (
                <div key={dayIndex} className="relative h-[60px] border-r border-border/50 hover:bg-white/2 cursor-pointer transition-colors"
                  onClick={() => handleCellClick(ymd(d), h)}>
                </div>
              ))}
            </div>
          ))}

          {events.filter(e => {
            if (!e.date) return false;
            const ed = parseYmd(e.date);
            return ed >= weekStart && ed <= weekDays[6];
          }).map(evt => {
            const area = areas.find(a => a.id === evt.areaId);
            if (!area) return null;
            const sub = area.topics.flatMap(t => t.subtopics).find(s => s.id === evt.subtopicId);
            const ed = parseYmd(evt.date);
            const dayIndex = ed.getDay();
            
            const top = (evt.startHour - 6) * 61;
            const height = evt.durationHours * 61 - 4;
            const width = `calc((100% - 60px) / 7 - 8px)`;

            return (
              <div key={evt.id} 
                className="absolute rounded-lg p-2.5 shadow-md text-white overflow-hidden cursor-pointer hover:brightness-110 transition-all border border-white/10 flex flex-col"
                style={{ 
                  top: `${top + 2}px`, 
                  left: `calc(60px + ${dayIndex} * ((100% - 60px) / 7) + 4px)`, 
                  height: `${height}px`, width,
                  backgroundColor: area.color 
                }}
                onClick={(e) => handleEventClick(e, evt)}
              >
                <div className="text-xs font-bold truncate leading-tight drop-shadow-sm">{sub?.name || area.name}</div>
                <div className="text-[10px] opacity-90 mt-auto font-medium bg-black/10 self-start px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full" /> {evt.durationHours}h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => {
    const map: Record<string, ScheduleEvent[]> = {};
    events.forEach(e => { 
      if (!e.date) return;
      if (!map[e.date]) map[e.date] = []; 
      map[e.date].push(e); 
    });

    return (
      <div className="bg-card border border-border rounded-xl shadow-sm mt-6 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {DAYS_SHORT.map(d => (
            <div key={d} className="p-3 text-center text-sm font-semibold text-foreground border-l border-border first:border-l-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthDays.map((d, i) => {
            const dateStr = ymd(d);
            const isToday = dateStr === ymd(TODAY);
            const isCurrentMonth = d.getMonth() === baseDate.getMonth();
            const dayEvents = (map[dateStr] || []).sort((a,b) => a.startHour - b.startHour);

            return (
              <div key={i} className={`min-h-[120px] p-2 border-b border-r border-border hover:bg-white/2 cursor-pointer transition-colors ${!isCurrentMonth ? 'bg-muted/10 opacity-50' : ''}`}
                onClick={() => handleCellClick(dateStr)}>
                <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-primary text-white' : 'text-foreground'}`}>
                  {d.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(evt => {
                    const area = areas.find(a => a.id === evt.areaId);
                    if (!area) return null;
                    const sub = area.topics.flatMap(t => t.subtopics).find(s => s.id === evt.subtopicId);
                    return (
                      <div key={evt.id} className="text-[10px] px-1.5 py-1 rounded text-white font-medium truncate shadow-sm transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: area.color }}
                        onClick={(e) => handleEventClick(e, evt)}>
                        {evt.startHour}h - {sub?.name || area.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const currentMonthName = `${MONTHS[baseDate.getMonth()]} de ${baseDate.getFullYear()}`;

  return (
    <div className="p-6 sm:p-8 space-y-6 w-full max-w-[2000px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#c084fc,#818cf8)" }}>
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cronograma</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize seus estudos e revise subtópicos.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end lg:self-auto">
          <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm">
            <button onClick={() => handleNav(-1)} className="p-1.5 hover:bg-muted text-muted-foreground rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => handleNav(1)} className="p-1.5 hover:bg-muted text-muted-foreground rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
            <button onClick={handleToday} className="px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors ml-1">Hoje</button>
          </div>

          <div className="text-lg font-semibold text-foreground min-w-[150px] text-center">
            {currentMonthName}
          </div>

          <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm">
            <button onClick={() => setView("semana")} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view === "semana" ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Semana</button>
            <button onClick={() => setView("mes")} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view === "mes" ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Mês</button>
          </div>
        </div>
      </div>

      {view === "semana" ? renderWeekView() : renderMonthView()}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEvent ? "Editar Aula" : "Agendar Matéria"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-sm font-medium text-muted-foreground mb-4">
                {selectedSlot?.date.split("-").reverse().join("/")} {selectedSlot?.hour !== undefined ? `às ${selectedSlot.hour}:00` : ''}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Matéria</label>
                <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Subtópico</label>
                <select value={form.subtopicId} onChange={e => setForm(f => ({ ...f, subtopicId: e.target.value }))}
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                  {allSubtopics.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {view === "mes" && !editingEvent && selectedSlot?.hour === 6 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Hora de Início</label>
                  <select value={selectedSlot?.hour} onChange={e => setSelectedSlot(s => s ? { ...s, hour: parseInt(e.target.value) } : null)}
                    className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                    {HOURS.map(h => <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Duração (Horas)</label>
                <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) }))}
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                  {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} Hora{h > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-5 bg-muted/30 border-t border-border">
              {editingEvent ? (
                <button onClick={handleDelete} className="text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              ) : <div></div>}
              <button onClick={handleSave} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
