import { create } from "zustand";

import { seedDate, seedEvents, seedView } from "./seed/data";
import type { SchedulerConfig, SchedulerEvent, SchedulerSnapshot, SchedulerView } from "./types";

export interface SchedulerStoreState {
  events: SchedulerEvent[];
  currentDate: number;
  view: SchedulerView;
  config: SchedulerConfig;

  past: SchedulerSnapshot[];
  future: SchedulerSnapshot[];
  maxHistory: number;

  setCurrentDate: (date: number) => void;
  setView: (view: SchedulerView) => void;

  createEvent: (event: Omit<SchedulerEvent, "id"> & Partial<Pick<SchedulerEvent, "id">>) => SchedulerEvent;
  updateEvent: (event: Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">) => void;
  deleteEvent: (id: SchedulerEvent["id"]) => void;

  undo: () => void;
  redo: () => void;
}

const deepCopy = <T,>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

const createSnapshot = (events: SchedulerEvent[]): SchedulerSnapshot => ({
  events: deepCopy(events),
});

// Simulate receiving an ID from a backend.
const generateId = () => `id_${Date.now().toString()}`;

export const useSchedulerStore = create<SchedulerStoreState>((set, get) => {
  const pushHistory = () => {
    const { events, past, maxHistory } = get();
    const snapshot = createSnapshot(events);

    set({
      past: [...past.slice(-maxHistory + 1), snapshot],
      future: [],
    });
  };

  return {
    events: seedEvents as unknown as SchedulerEvent[],
    currentDate: seedDate,
    view: seedView as SchedulerView,
    config: {},

    past: [],
    future: [],
    maxHistory: 50,

    setCurrentDate: (date) => set({ currentDate: date }),
    setView: (view) => set({ view }),

    createEvent: (event) => {
      pushHistory();

      const id = event.id != null ? event.id : generateId();
      const newEvent: SchedulerEvent = { ...event, id } as SchedulerEvent;

      set({ events: [...get().events, newEvent] });
      return newEvent;
    },

    updateEvent: (event) => {
      const events = get().events;
      const index = events.findIndex((e) => String(e.id) === String(event.id));
      if (index === -1) return;

      pushHistory();
      set({
        events: [...events.slice(0, index), { ...events[index], ...event }, ...events.slice(index + 1)],
      });
    },

    deleteEvent: (id) => {
      const events = get().events;
      const exists = events.some((e) => String(e.id) === String(id));
      if (!exists) return;

      pushHistory();
      set({ events: events.filter((e) => String(e.id) !== String(id)) });
    },

    undo: () => {
      const { past, future, events } = get();
      if (past.length === 0) return;

      const previous = past[past.length - 1];
      set({
        events: previous.events,
        past: past.slice(0, -1),
        future: [createSnapshot(events), ...future],
      });
    },

    redo: () => {
      const { past, future, events } = get();
      if (future.length === 0) return;

      const next = future[0];
      set({
        events: next.events,
        past: [...past, createSnapshot(events)],
        future: future.slice(1),
      });
    },
  };
});
