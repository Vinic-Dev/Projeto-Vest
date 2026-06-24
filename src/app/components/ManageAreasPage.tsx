import React, { useState } from "react";
import { Area } from "../types";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Settings } from "lucide-react";

export default function ManageAreasPage({ areas, onSave }: { areas: Area[]; onSave: (a: Area[]) => void }) {
  const [draft, setDraft] = useState<Area[]>(JSON.parse(JSON.stringify(areas)));
  const [openAreaId, setOpenAreaId] = useState<string | null>(null);

  const handleSave = () => {
    onSave(draft);
  };

  const addArea = () => {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      name: "Nova Matéria",
      short: "NOV",
      color: "#3b82f6",
      topics: []
    };
    setDraft([...draft, newArea]);
    setOpenAreaId(newArea.id);
  };

  const updateArea = (id: string, changes: Partial<Area>) => {
    setDraft(draft.map(a => a.id === id ? { ...a, ...changes } : a));
  };

  const deleteArea = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta matéria e todo seu progresso?")) {
      setDraft(draft.filter(a => a.id !== id));
    }
  };

  const addTopic = (areaId: string) => {
    setDraft(draft.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        topics: [...a.topics, { id: `topic-${Date.now()}`, name: "Novo Tópico", subtopics: [] }]
      };
    }));
  };

  const updateTopic = (areaId: string, topicId: string, name: string) => {
    setDraft(draft.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        topics: a.topics.map(t => t.id === topicId ? { ...t, name } : t)
      };
    }));
  };

  const deleteTopic = (areaId: string, topicId: string) => {
    if (confirm("Tem certeza que deseja excluir este tópico?")) {
      setDraft(draft.map(a => {
        if (a.id !== areaId) return a;
        return { ...a, topics: a.topics.filter(t => t.id !== topicId) };
      }));
    }
  };

  const addSubtopic = (areaId: string, topicId: string) => {
    setDraft(draft.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        topics: a.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: [...t.subtopics, {
              id: `sub-${Date.now()}`,
              name: "Novo Subtópico",
              status: "not_started",
              mastery: 1,
              lastReview: null,
              nextReview: null
            }]
          };
        })
      };
    }));
  };

  const updateSubtopic = (areaId: string, topicId: string, subId: string, name: string) => {
    setDraft(draft.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        topics: a.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: t.subtopics.map(s => s.id === subId ? { ...s, name } : s)
          };
        })
      };
    }));
  };

  const deleteSubtopic = (areaId: string, topicId: string, subId: string) => {
    setDraft(draft.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        topics: a.topics.map(t => {
          if (t.id !== topicId) return t;
          return { ...t, subtopics: t.subtopics.filter(s => s.id !== subId) };
        })
      };
    }));
  };

  return (
    <div className="p-6 sm:p-8 w-full max-w-[2000px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Gerenciar Matérias
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Crie e edite sua grade curricular de estudos personalizada.</p>
        </div>
        <button onClick={handleSave} className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="space-y-4">
        {draft.map(area => (
          <div key={area.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white/3">
              <button onClick={() => setOpenAreaId(openAreaId === area.id ? null : area.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-muted-foreground">
                {openAreaId === area.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_80px_60px] gap-3">
                <input type="text" value={area.name} onChange={e => updateArea(area.id, { name: e.target.value })} 
                  className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary" placeholder="Nome da Matéria" />
                <input type="text" value={area.short} onChange={e => updateArea(area.id, { short: e.target.value })} 
                  className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm uppercase text-center focus:outline-none focus:border-primary" placeholder="Sigla" maxLength={4} />
                <input type="color" value={area.color} onChange={e => updateArea(area.id, { color: e.target.value })} 
                  className="w-full h-8 rounded cursor-pointer border-0 p-0" title="Cor" />
              </div>

              <button onClick={() => deleteArea(area.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors ml-auto">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {openAreaId === area.id && (
              <div className="p-4 border-t border-border space-y-4 bg-background/50">
                {area.topics.map(topic => (
                  <div key={topic.id} className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <input type="text" value={topic.name} onChange={e => updateTopic(area.id, topic.id, e.target.value)} 
                        className="flex-1 bg-transparent border border-border rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary" placeholder="Nome do Tópico" />
                      <button onClick={() => deleteTopic(area.id, topic.id)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pl-4 border-l-2 border-border/50 space-y-2">
                      {topic.subtopics.map(sub => (
                        <div key={sub.id} className="flex items-center gap-2">
                          <input type="text" value={sub.name} onChange={e => updateSubtopic(area.id, topic.id, sub.id, e.target.value)} 
                            className="flex-1 bg-transparent border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:border-primary" placeholder="Nome do Subtópico" />
                          <button onClick={() => deleteSubtopic(area.id, topic.id, sub.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-destructive transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addSubtopic(area.id, topic.id)} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors py-1">
                        <Plus className="w-3 h-3" /> Adicionar Subtópico
                      </button>
                    </div>
                  </div>
                ))}
                
                <button onClick={() => addTopic(area.id)} className="w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Novo Tópico
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={addArea} className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium">
        <Plus className="w-5 h-5" /> Adicionar Nova Matéria
      </button>

    </div>
  );
}
