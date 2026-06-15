// Geteilter Zustand des laufenden Pomodoro-Timers über localStorage.
//
// Warum localStorage statt React-State: Der Timer (pomodoro/Timer.tsx) ist eine
// Client-Komponente, deren State beim Seitenwechsel (z.B. zum Dashboard)
// verloren ginge. Durch Persistenz mit absolutem Ablaufzeitpunkt (`endTime`)
// kann sowohl der Timer selbst nach Rückkehr wiederhergestellt werden als auch
// das Dashboard einen mitlaufenden Countdown anzeigen — ohne zusätzliche
// State-Library. Die verbleibende Zeit wird stets aus `endTime - Date.now()`
// berechnet, daher entsteht kein Drift, egal welche Seite gerade offen ist.

const STORAGE_KEY = "provity:pomodoro";

export type PersistedTimerStatus = "running" | "paused";

export type PersistedTimer = {
  status: PersistedTimerStatus;
  /** Epoch-ms des Ablaufs; gesetzt wenn `running`, sonst null. */
  endTime: number | null;
  /** Verbleibende ms — Snapshot für `paused` (und Basis beim Start). */
  remainingMs: number;
  durationMinutes: number;
};

export function readTimer(): PersistedTimer | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PersistedTimer>;
    // Defensive Validierung: beschädigte/fremde Werte ignorieren, sonst
    // entstünde z.B. NaN im Countdown ("NaN:NaN").
    const validStatus = parsed.status === "running" || parsed.status === "paused";
    const validRemaining =
      typeof parsed.remainingMs === "number" && Number.isFinite(parsed.remainingMs);
    const validDuration =
      typeof parsed.durationMinutes === "number" &&
      Number.isFinite(parsed.durationMinutes);
    const validEndTime =
      parsed.endTime === null ||
      (typeof parsed.endTime === "number" && Number.isFinite(parsed.endTime));
    // Ein laufender Timer braucht zwingend einen Ablaufzeitpunkt.
    const runningHasEndTime =
      parsed.status !== "running" || typeof parsed.endTime === "number";

    if (
      !validStatus ||
      !validRemaining ||
      !validDuration ||
      !validEndTime ||
      !runningHasEndTime
    ) {
      return null;
    }
    return parsed as PersistedTimer;
  } catch {
    return null;
  }
}

export function writeTimer(state: PersistedTimer): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Speicher voll / nicht verfügbar — Timer funktioniert weiter, nur ohne
    // Persistenz über Seitenwechsel hinweg.
  }
}

export function clearTimer(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nicht verfügbar — siehe writeTimer.
  }
}

/** mm:ss aus Gesamtsekunden; negative Werte werden auf 0 geklemmt. */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
