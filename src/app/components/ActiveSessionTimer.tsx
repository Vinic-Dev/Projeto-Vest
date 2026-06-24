import React, { useState, useEffect, useRef } from "react";
import { Area, Session } from "../types";
import { Play, Pause, Square, X, Clock } from "lucide-react";

export default function ActiveSessionTimer({ areas, onSaveSession }: { areas: Area[]; onSaveSession: (s: Session) => void }) {
  const [mode, setMode] = useState<"form" | "timer">("form");
  const [form, setForm] = useState({ areaId: areas[0]?.id || "", topicName: "", duration: "", notes: "" });
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer finished
      setIsRunning(false);
      finishSession(totalTime);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (!form.topicName.trim() || !form.duration) return;
    const durationMinutes = parseInt(form.duration);
    if (isNaN(durationMinutes) || durationMinutes <= 0) return;
    
    const durationSeconds = durationMinutes * 60;
    setTotalTime(durationSeconds);
    setTimeLeft(durationSeconds);
    setIsRunning(true);
    setMode("timer");
  };

  const finishSession = (elapsedSeconds: number) => {
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    onSaveSession({
      id: `s${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      areaId: form.areaId,
      topicName: form.topicName.trim(),
      duration: elapsedMinutes,
      notes: form.notes.trim(),
    });
    setMode("form");
    setForm({ areaId: areas[0]?.id || "", topicName: "", duration: "", notes: "" });
  };

  const handleStopEarly = () => {
    if (confirm("Deseja encerrar a sessão agora e salvar o tempo estudado?")) {
      setIsRunning(false);
      const elapsed = totalTime - timeLeft;
      finishSession(elapsed);
    }
  };

  const handleCancel = () => {
    if (confirm("Deseja cancelar esta sessão? O tempo não será salvo.")) {
      setIsRunning(false);
      setMode("form");
    }
  };

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  
  const progressPct = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const activeArea = areas.find(a => a.id === form.areaId);
  const color = activeArea?.color || "#3b82f6";

  if (mode === "timer") {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl" style={{ boxShadow: `0 10px 40px -10px ${color}30` }}>
        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progressPct}%`, background: color }} />
        </div>
        
        <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-widest">{activeArea?.name}</div>
        <div className="text-xl font-bold text-foreground mb-8 text-center">{form.topicName}</div>

        <div className="relative flex items-center justify-center w-64 h-64 mb-8">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
            <circle cx="128" cy="128" r="120" stroke={color} strokeWidth="8" fill="transparent" 
              strokeDasharray={2 * Math.PI * 120} 
              strokeDashoffset={2 * Math.PI * 120 * (1 - progressPct / 100)} 
              className="transition-all duration-1000 ease-linear" strokeLinecap="round" />
          </svg>
          <div className="text-7xl font-black tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace", color }}>
            {mins}:{secs}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsRunning(!isRunning)} 
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: color }}>
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button onClick={handleStopEarly} title="Encerrar e Salvar"
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-colors">
            <Square className="w-5 h-5" />
          </button>

          <button onClick={handleCancel} title="Cancelar Sessão"
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-destructive/20 text-destructive transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Clock className="w-5 h-5 text-primary" />
        Nova Sessão de Estudos
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Matéria</label>
          <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
            className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50 transition-colors">
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Duração (min)</label>
          <input type="number" min="1" max="600" placeholder="Ex: 60" value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Tópico estudado</label>
        <input type="text" placeholder="Ex: Função Logarítmica e Exponencial" value={form.topicName}
          onChange={e => setForm(f => ({ ...f, topicName: e.target.value }))}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Anotações (opcional)</label>
        <textarea rows={2} placeholder="Principais dificuldades ou pontos chave..." value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50 resize-none" />
      </div>
      <button onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-md hover:shadow-primary/30 mt-2">
        <Play className="w-5 h-5" /> Iniciar Cronômetro
      </button>
    </div>
  );
}
