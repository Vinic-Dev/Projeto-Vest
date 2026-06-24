export type Status = "not_started" | "learning" | "practicing" | "mastered" | "revision_needed";
export type Page = "dashboard" | "schedule" | "area" | "manage";

export interface Subtopic {
  id: string;
  name: string;
  status: Status;
  mastery: number;
  lastReview: string | null;
  nextReview: string | null;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Area {
  id: string;
  name: string;
  short: string;
  color: string;
  topics: Topic[];
}

export interface Session {
  id: string;
  date: string;
  duration: number;
  areaId: string;
  topicName: string;
  notes: string;
}

export interface ScheduleEvent {
  id: string;
  dayOfWeek: number; // 0 (Dom) to 6 (Sab)
  startHour: number; // 6 to 23
  durationHours: number;
  areaId: string;
}
