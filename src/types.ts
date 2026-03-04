export type SchedulerView = "day" | "week" | "month";

export interface SchedulerEvent {
  id: string | number;
  start_date: string;
  end_date: string;
  text: string;

  // Scheduler may attach extra fields (e.g. custom props). Keep the demo permissive.
  [key: string]: unknown;
}

export type SchedulerConfig = Record<string, unknown>;

export interface SchedulerSnapshot {
  events: SchedulerEvent[];
}
