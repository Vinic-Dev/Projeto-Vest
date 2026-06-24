const fs = require('fs');

const lines = fs.readFileSync('matriz_referencia_enem.csv', 'latin1').split('\n').slice(1).filter(l => l.trim() !== '');

const areasMap = {
  'Linguagem, Códigos e suas Tecnologias': { id: 'lin', name: 'Linguagens', short: 'LIN', color: '#4ade80', topics: {} },
  'Matemática e suas Tecnologias': { id: 'mat', name: 'Matemática', short: 'MAT', color: '#60a5fa', topics: {} },
  'Ciências da Natureza e suas Tecnologias': { id: 'nat', name: 'Ciências da Natureza', short: 'NAT', color: '#22d3ee', topics: {} },
  'Ciências Humanas e suas Tecnologias': { id: 'hum', name: 'Ciências Humanas', short: 'HUM', color: '#a78bfa', topics: {} }
};

let subtopicIdCounter = 1;
let topicIdCounter = 1;

lines.forEach(line => {
  const [areaName, disciplina, topico, subtopico] = line.split(';').map(s => s.trim());
  if(!areaName || !topico || !subtopico) return;
  
  let areaObj = areasMap[areaName];
  if(!areaObj) return;

  if(!areaObj.topics[topico]) {
    areaObj.topics[topico] = {
      id: areaObj.id + '-t' + topicIdCounter++,
      name: topico,
      subtopics: []
    };
  }
  
  areaObj.topics[topico].subtopics.push({
    id: areaObj.id + '-s' + subtopicIdCounter++,
    name: subtopico
  });
});

const INITIAL_AREAS = Object.values(areasMap).map(a => ({
  id: a.id,
  name: a.name,
  short: a.short,
  color: a.color,
  topics: Object.values(a.topics)
}));

const tsContent = `// Gerado automaticamente a partir de matriz_referencia_enem.csv
import { Area, Status, Subtopic } from "./types";

const TODAY = new Date();
const dStr = (offset: number) => new Date(TODAY.getTime() + offset * 86400000).toISOString().split("T")[0];

const sub = (id: string, name: string, status: Status = "not_started", mastery: number = 1, lastDaysAgo?: number, nextDaysFrom?: number): Subtopic => ({
  id, name, status, mastery,
  lastReview: lastDaysAgo != null ? dStr(-lastDaysAgo) : null,
  nextReview: nextDaysFrom != null ? dStr(nextDaysFrom) : null,
});

export const INITIAL_AREAS: Area[] = ${JSON.stringify(INITIAL_AREAS, null, 2)};

// Aplicar status padrão nos subtópicos
INITIAL_AREAS.forEach(area => {
  area.topics.forEach(topic => {
    topic.subtopics = topic.subtopics.map(s => sub(s.id, s.name));
  });
});
`;

fs.writeFileSync('src/app/data.ts', tsContent);
console.log('src/app/data.ts gerado com sucesso!');
