import { useCallback, useMemo } from "react";
import ReactScheduler from "@dhtmlx/trial-react-scheduler";
import "@dhtmlx/trial-react-scheduler/dist/react-scheduler.css";

import Toolbar from "./Toolbar";
import { useSchedulerStore } from "../store";
import type { SchedulerEvent, SchedulerView } from "../types";

export default function DemoZustandScheduler() {
  const events = useSchedulerStore((s) => s.events);
  const view = useSchedulerStore((s) => s.view);
  const currentDate = useSchedulerStore((s) => s.currentDate);
  const config = useSchedulerStore((s) => s.config);

  const setView = useSchedulerStore((s) => s.setView);
  const setCurrentDate = useSchedulerStore((s) => s.setCurrentDate);
  const createEvent = useSchedulerStore((s) => s.createEvent);
  const updateEvent = useSchedulerStore((s) => s.updateEvent);
  const deleteEvent = useSchedulerStore((s) => s.deleteEvent);
  const undo = useSchedulerStore((s) => s.undo);
  const redo = useSchedulerStore((s) => s.redo);

  const canUndo = useSchedulerStore((s) => s.past.length > 0);
  const canRedo = useSchedulerStore((s) => s.future.length > 0);

  const activeDate = useMemo(() => new Date(currentDate), [currentDate]);

  const handleDateNavigation = useCallback((action: "prev" | "next" | "today") => {
    if (action === "today") {
      setCurrentDate(Date.now());
      return;
    }

    const step = action === "next" ? 1 : -1;
    const date = new Date(currentDate);

    if (view === "day") {
      date.setDate(date.getDate() + step);
    } else if (view === "week") {
      date.setDate(date.getDate() + step * 7);
    } else {
      date.setMonth(date.getMonth() + step);
    }
    setCurrentDate(date.getTime());
  }, [currentDate, view, setCurrentDate]);

  // Scheduler <-> Zustand data bridge (maps Scheduler CRUD events to store actions)
  const dataBridge = useMemo(() => ({
    save: (entity: string, action: string, payload: unknown, id: unknown) => {
      if (entity !== "event") return;

      switch (action) {
        case "update": {
          const eventData = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
          const eventId = (eventData as Record<string, unknown>).id ?? id;
          if (eventId == null) {
            console.warn("Update called without an id", { payload, id });
            return;
          }
          return updateEvent({ ...eventData, id: eventId } as Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">);
        }
        case "create":
          return createEvent(payload as Omit<SchedulerEvent, "id">);
        case "delete": {
          const deleteId =
            payload && typeof payload === "object"
              ? (payload as Record<string, unknown>).id ?? id
              : payload ?? id;
          if (deleteId == null) {
            console.warn("Delete called without an id", { payload, id });
            return;
          }
          return deleteEvent(deleteId as SchedulerEvent["id"]);
        }
        default:
          console.warn(`Unknown action: ${action}`);
          return;
      }
    },
  }), [updateEvent, createEvent, deleteEvent]);

  const handleViewChange = useCallback(
    (mode: string, date: Date) => {
      const nextView: SchedulerView = mode === "day" || mode === "week" || mode === "month" ? mode : "month";
      setView(nextView);
      setCurrentDate(date.getTime());
    },
    [setView, setCurrentDate]
  );

  const handleSetView = useCallback((nextView: SchedulerView) => setView(nextView), [setView]);

  const handleUndo = useCallback(() => undo(), [undo]);
  const handleRedo = useCallback(() => redo(), [redo]);
  const memoizedXY = useMemo(() => ({ nav_height: 0 }), []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar
        currentView={view}
        currentDate={activeDate}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNavigate={handleDateNavigation}
        setView={handleSetView}
      />

      <ReactScheduler
        events={events}
        view={view}
        date={activeDate}
        xy={memoizedXY} /* hide built-in navbar */
        config={config}
        data={dataBridge}
        onViewChange={handleViewChange}
      />
    </div>
  );
}
