export type Status = "not_started" | "learning" | "practicing" | "mastered" | "revision_needed";
export type Page = "dashboard" | "area" | "analytics" | "sessions";

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
