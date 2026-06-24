import React, { useState } from "react";
import { Area, ScheduleEvent } from "../types";
import { Calendar, X, Trash2 } from "lucide-react";

export default function SchedulePage({ areas, events, onSave }: {
  areas: Area[];
  events: ScheduleEvent[];
  onSave: (events: ScheduleEvent[]) => void;
}) {
  const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [form, setForm] = useState({ areaId: areas[0]?.id || "", duration: 1 });
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const handleCellClick = (day: number, hour: number) => {
    // Check if slot is occupied
    const existing = events.find(e => e.dayOfWeek === day && hour >= e.startHour && hour < e.startHour + e.durationHours);
    if (existing) {
      setEditingEvent(existing);
      setForm({ areaId: existing.areaId, duration: existing.durationHours });
      setSelectedSlot(null);
      setModalOpen(true);
    } else {
      setSelectedSlot({ day, hour });
      setEditingEvent(null);
      setForm({ areaId: areas[0]?.id || "", duration: 1 });
      setModalOpen(true);
    }
  };

  const handleSave = () => {
    if (!form.areaId) return;

    if (editingEvent) {
      const updated = events.map(e => e.id === editingEvent.id ? { ...e, areaId: form.areaId, durationHours: form.duration } : e);
      onSave(updated);
    } else if (selectedSlot) {
      // Check collision
      const hasCollision = events.some(e => 
        e.dayOfWeek === selectedSlot.day &&
        selectedSlot.hour < e.startHour + e.durationHours && 
        selectedSlot.hour + form.duration > e.startHour
      );
      if (hasCollision) {
        alert("Já existe uma matéria neste horário!");
        return;
      }

      const newEvent: ScheduleEvent = {
        id: `evt_${Date.now()}`,
        dayOfWeek: selectedSlot.day,
        startHour: selectedSlot.hour,
        durationHours: form.duration,
        areaId: form.areaId
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

  return (
    <div className="p-6 sm:p-8 space-y-6 w-full max-w-[2000px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#c084fc,#818cf8)" }}>
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cronograma Semanal</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize sua rotina de estudos. Clique em um horário para adicionar matérias.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        <div className="min-w-[800px] select-none">
          {/* Header */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/30">
            <div className="p-3"></div>
            {DAYS.map((d, i) => (
              <div key={i} className="p-3 text-center text-sm font-semibold text-foreground border-l border-border">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="relative">
            {HOURS.map(h => (
              <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50">
                <div className="py-2 px-1 text-xs font-medium text-muted-foreground text-right border-r border-border">
                  {h.toString().padStart(2, '0')}:00
                </div>
                {DAYS.map((_, dayIndex) => (
                  <div key={dayIndex} className="relative h-[60px] border-r border-border/50 hover:bg-white/2 cursor-pointer transition-colors"
                    onClick={() => handleCellClick(dayIndex, h)}>
                  </div>
                ))}
              </div>
            ))}

            {/* Events Overlay */}
            {events.map(evt => {
              const area = areas.find(a => a.id === evt.areaId);
              if (!area) return null;
              
              // Calculate positioning
              // Each hour row is h-[60px] = 60px + 1px border = 61px.
              const top = (evt.startHour - 6) * 61;
              const height = evt.durationHours * 61 - 4; // -4 for padding
              const width = `calc((100% - 60px) / 7 - 8px)`;

              return (
                <div key={evt.id} 
                  className="absolute rounded-lg p-2.5 shadow-md text-white overflow-hidden cursor-pointer hover:brightness-110 transition-all border border-white/10"
                  style={{ 
                    top: `${top + 2}px`, 
                    left: `calc(60px + ${evt.dayOfWeek} * ((100% - 60px) / 7) + 4px)`, 
                    height: `${height}px`,
                    width,
                    backgroundColor: area.color 
                  }}
                  onClick={(e) => { e.stopPropagation(); handleCellClick(evt.dayOfWeek, evt.startHour); }}
                >
                  <div className="text-xs font-bold truncate leading-tight drop-shadow-sm">{area.name}</div>
                  <div className="text-[10px] opacity-90 mt-1 font-medium bg-black/10 inline-block px-1.5 py-0.5 rounded">
                    {evt.startHour}:00 - {evt.startHour + evt.durationHours}:00
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEvent ? "Editar Matéria" : "Agendar Matéria"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Matéria</label>
                <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
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
