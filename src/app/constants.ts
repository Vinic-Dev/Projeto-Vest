import { Status } from "./types";

export const STATUS_CFG: Record<Status, { label: string; color: string; bg: string }> = {
  not_started:     { label: "Não iniciado", color: "#4b5d7a", bg: "rgba(75,93,122,0.15)" },
  learning:        { label: "Aprendendo",   color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  practicing:      { label: "Praticando",   color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  mastered:        { label: "Dominado",     color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  revision_needed: { label: "Revisar",      color: "#f87171", bg: "rgba(248,113,113,0.15)" },
};

export const STATUS_CYCLE: Status[] = ["not_started", "learning", "practicing", "mastered", "revision_needed"];

const VEST_DATE = new Date("2026-11-03");
const TODAY = new Date();
export const DAYS_TO_VEST = Math.ceil((VEST_DATE.getTime() - TODAY.getTime()) / 86400000);
