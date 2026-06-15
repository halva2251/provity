"use client";

import { useEffect, useState, type ReactNode } from "react";

import { formatTime, readTimer } from "@/lib/pomodoroTimer";

type LiveState = {
  status: "running" | "paused" | "finished";
  remainingSeconds: number;
};

const STATUS_LABEL: Record<LiveState["status"], string> = {
  running: "Timer läuft …",
  paused: "Pausiert",
  finished: "Session abgeschlossen — im Timer abschliessen",
};

/**
 * Zeigt auf dem Dashboard einen mitlaufenden Pomodoro-Countdown, sobald ein
 * Timer läuft oder pausiert ist (Quelle: localStorage via pomodoroTimer).
 * Ist kein Timer aktiv, wird `fallback` (die statischen Session-Zahlen)
 * gerendert.
 *
 * Erste Render-Ausgabe ist bewusst `fallback` (Server kennt kein localStorage)
 * — der aktive Zustand wird erst nach dem Mounten im Effekt gesetzt, daher
 * keine Hydration-Diskrepanz.
 */
export function PomodoroLiveStatus({ fallback }: { fallback: ReactNode }) {
  const [live, setLive] = useState<LiveState | null>(null);

  useEffect(() => {
    const sync = () => {
      const persisted = readTimer();
      if (!persisted) {
        setLive(null);
        return;
      }
      if (persisted.status === "paused") {
        setLive({
          status: "paused",
          remainingSeconds: Math.ceil(persisted.remainingMs / 1000),
        });
        return;
      }
      if (persisted.status === "running" && persisted.endTime !== null) {
        const remaining = persisted.endTime - Date.now();
        setLive(
          remaining <= 0
            ? { status: "finished", remainingSeconds: 0 }
            : { status: "running", remainingSeconds: Math.ceil(remaining / 1000) },
        );
      }
    };

    sync();
    // 500ms-Takt für eine flüssige Anzeige; storage-Event deckt andere Tabs ab.
    const intervalId = setInterval(sync, 500);
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!live) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-3xl font-semibold tabular-nums text-black dark:text-zinc-50">
        {formatTime(live.remainingSeconds)}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {STATUS_LABEL[live.status]}
      </p>
    </div>
  );
}
