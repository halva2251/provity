"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearTimer,
  formatTime,
  readTimer,
  writeTimer,
  type PomodoroPhase,
} from "@/lib/pomodoroTimer";

import { logSession } from "./actions";

type TimerStatus = "idle" | "running" | "paused" | "finished";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  work: "Arbeit",
  break: "Pause",
};

function otherPhase(phase: PomodoroPhase): PomodoroPhase {
  return phase === "work" ? "break" : "work";
}

// Kurzer Beep bei Ablauf — best effort, ohne externe Assets (Web Audio API).
function playBeep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return;
    }
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.1;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
    oscillator.onended = () => ctx.close();
  } catch {
    // Audio nicht verfügbar (z.B. ohne Nutzerinteraktion) — visuelles Feedback genügt.
  }
}

export function Timer({
  workMinutes,
  breakMinutes,
}: {
  workMinutes: number;
  breakMinutes: number;
}) {
  const router = useRouter();

  const msFor = useCallback(
    (phase: PomodoroPhase) => (phase === "work" ? workMinutes : breakMinutes) * 60 * 1000,
    [workMinutes, breakMinutes],
  );

  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingMs, setRemainingMs] = useState(() => workMinutes * 60 * 1000);
  // Fehler beim Speichern der abgeschlossenen Session sichtbar machen.
  const [saveError, setSaveError] = useState<string | null>(null);

  // Zeitpunkt, zu dem der Timer ablaufen soll (Date.now()-Basis). Die verbleibende
  // Zeit wird daraus berechnet, statt einen Zähler zu dekrementieren — so entsteht
  // kein Drift durch ungenaue setInterval-Intervalle.
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Verhindert doppeltes Speichern, falls finish() je mehrfach ausgelöst würde.
  const finishedRef = useRef(false);
  // Phase zusätzlich als Ref: finish()/tick()/startTick() müssen STABIL bleiben
  // (keine Abhängigkeit vom phase-State), sonst liefe der einmalige
  // Hydration-Effekt bei jedem Phasenwechsel erneut. setPhaseBoth hält State und
  // Ref synchron; finish() liest die Phase ausschliesslich über die Ref.
  const phaseRef = useRef<PomodoroPhase>("work");

  const setPhaseBoth = useCallback((next: PomodoroPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // `silent` unterdrückt den Beep — genutzt, wenn ein bereits abgelaufener Timer
  // beim Öffnen der Seite nachträglich abgeschlossen wird (kein überraschender
  // Ton beim blossen Navigieren).
  const finish = useCallback(
    ({ silent = false }: { silent?: boolean } = {}) => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      clearTick();
      endTimeRef.current = null;
      // Laufenden Zustand löschen: Dashboard/Timer zeigen danach keinen aktiven
      // Countdown mehr an.
      clearTimer();
      setRemainingMs(0);
      setStatus("finished");
      setSaveError(null);
      if (!silent) {
        playBeep();
      }
      // Nur abgeschlossene ARBEITS-Sessions werden gespeichert und gezählt —
      // Pausen sind keine Pomodoros. Phase über die Ref lesen, damit finish stabil
      // bleibt. Fehler anzeigen, statt still zu verschlucken.
      if (phaseRef.current === "work") {
        logSession()
          .then(() => router.refresh())
          .catch(() => setSaveError("Session konnte nicht gespeichert werden."));
      }
    },
    [clearTick, router],
  );

  const tick = useCallback(() => {
    if (endTimeRef.current === null) {
      return;
    }
    const remaining = endTimeRef.current - Date.now();
    if (remaining <= 0) {
      finish();
    } else {
      setRemainingMs(remaining);
    }
  }, [finish]);

  const startTick = useCallback(() => {
    clearTick();
    // 200ms-Takt sorgt für eine flüssige Anzeige; die Genauigkeit kommt aus endTimeRef.
    intervalRef.current = setInterval(tick, 200);
  }, [clearTick, tick]);

  // Interval beim Unmount aufräumen (Cleanup-Funktion des Effekts).
  useEffect(() => () => clearTick(), [clearTick]);

  // Beim Mounten einen ggf. in localStorage laufenden Timer wiederherstellen,
  // damit er Seitenwechsel (Dashboard ↔ Pomodoro) überlebt. `finish`/`startTick`/
  // `setPhaseBoth` sind stabile useCallbacks, daher läuft der Effekt effektiv
  // genau einmal. Die Hydration MUSS nach dem Mounten erfolgen — während
  // SSR/erstem Render gibt es kein localStorage; eine Lazy-Init in useState würde
  // eine Hydration-Diskrepanz erzeugen (deshalb setState hier statt im
  // Initializer). set-state-in-effect ist hier bewusst in Kauf genommen.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const persisted = readTimer();
    if (!persisted) {
      return;
    }
    // Phase zuerst (synchron in die Ref), damit ein eventuelles finish() unten
    // die richtige Phase fürs Speichern kennt.
    setPhaseBoth(persisted.phase);
    if (persisted.status === "paused") {
      setRemainingMs(persisted.remainingMs);
      setStatus("paused");
      return;
    }
    if (persisted.status === "running" && persisted.endTime !== null) {
      const remaining = persisted.endTime - Date.now();
      endTimeRef.current = persisted.endTime;
      if (remaining <= 0) {
        // Während der Abwesenheit abgelaufen -> jetzt abschliessen (Arbeits-Session
        // wird gespeichert), aber ohne Beep beim blossen Navigieren.
        finish({ silent: true });
      } else {
        finishedRef.current = false;
        setRemainingMs(remaining);
        setStatus("running");
        startTick();
      }
    }
  }, [finish, startTick, setPhaseBoth]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleStart = useCallback(() => {
    // Aus "finished" zum nächsten Intervall wechseln (Arbeit <-> Pause), aus
    // "paused" fortsetzen, aus "idle" das aktuelle Intervall starten.
    const startPhase = status === "finished" ? otherPhase(phase) : phase;
    const basisMs = status === "paused" ? remainingMs : msFor(startPhase);
    setPhaseBoth(startPhase);
    finishedRef.current = false;
    setSaveError(null);
    endTimeRef.current = Date.now() + basisMs;
    setRemainingMs(basisMs);
    setStatus("running");
    startTick();
    // Lauf persistieren, damit das Dashboard den Countdown mitzeigen kann.
    writeTimer({
      status: "running",
      endTime: endTimeRef.current,
      remainingMs: basisMs,
      durationMinutes: startPhase === "work" ? workMinutes : breakMinutes,
      phase: startPhase,
    });
  }, [status, phase, remainingMs, msFor, startTick, setPhaseBoth, workMinutes, breakMinutes]);

  const handlePause = useCallback(() => {
    if (status !== "running") {
      return;
    }
    clearTick();
    const snapshotMs =
      endTimeRef.current !== null
        ? Math.max(0, endTimeRef.current - Date.now())
        : remainingMs;
    setRemainingMs(snapshotMs);
    endTimeRef.current = null;
    setStatus("paused");
    writeTimer({
      status: "paused",
      endTime: null,
      remainingMs: snapshotMs,
      durationMinutes: phase === "work" ? workMinutes : breakMinutes,
      phase,
    });
  }, [status, clearTick, remainingMs, phase, workMinutes, breakMinutes]);

  const handleReset = useCallback(() => {
    clearTick();
    finishedRef.current = false;
    setSaveError(null);
    endTimeRef.current = null;
    // Reset führt stets zurück zum Arbeits-Intervall (Ausstieg aus einer Pause).
    setPhaseBoth("work");
    setRemainingMs(msFor("work"));
    setStatus("idle");
    // Persistierten Lauf verwerfen.
    clearTimer();
  }, [clearTick, msFor, setPhaseBoth]);

  const isFinished = status === "finished";
  const isBreak = phase === "break";
  const nextPhase = otherPhase(phase);
  // Aufrunden, damit die letzte Sekunde voll angezeigt wird und nie "00:00"
  // erscheint, solange der Timer noch läuft.
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  const startLabel =
    status === "paused"
      ? "Weiter"
      : isFinished
        ? `${PHASE_LABEL[nextPhase]} starten`
        : "Start";

  return (
    <div
      className={`flex flex-col items-center gap-6 rounded-lg border bg-white p-8 dark:bg-zinc-950 ${
        isFinished
          ? "border-green-500 dark:border-green-500"
          : isBreak
            ? "border-teal-500 dark:border-teal-500"
            : "border-black/[.08] dark:border-white/[.145]"
      }`}
    >
      {/* Aktuelles Intervall sichtbar machen (Arbeit/Pause). */}
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
          isBreak
            ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200"
            : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
        }`}
      >
        {PHASE_LABEL[phase]}
      </span>

      <div
        className={`font-mono text-6xl font-semibold tabular-nums ${
          isFinished
            ? "text-green-600 motion-safe:animate-pulse dark:text-green-400"
            : "text-black dark:text-zinc-50"
        }`}
        role="timer"
        aria-live="off"
      >
        {formatTime(remainingSeconds)}
      </div>

      {/* Eine einzige, dauerhaft vorhandene Live-Region: kündigt nur
          Status-Wechsel an (nicht jeden Sekunden-Tick), inkl. Abschluss und
          Speicherfehler. */}
      <div
        className="flex min-h-[2.5rem] flex-col items-center justify-center gap-1 text-center"
        role="status"
        aria-live="polite"
      >
        {isFinished ? (
          <>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {phase === "work"
                ? "Arbeitssession abgeschlossen! Zeit für eine Pause."
                : "Pause beendet! Bereit für die nächste Session."}
            </p>
            {saveError && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {saveError}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {status === "running"
              ? `${PHASE_LABEL[phase]} läuft …`
              : status === "paused"
                ? "Pausiert"
                : `Bereit — ${PHASE_LABEL[phase]} ${phase === "work" ? workMinutes : breakMinutes} Minuten`}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={status === "running"}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
        >
          {startLabel}
        </button>

        <button
          type="button"
          onClick={handlePause}
          disabled={status !== "running"}
          className="rounded-full border border-black/[.08] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Pause
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={status === "idle" && phase === "work"}
          className="rounded-full border border-black/[.08] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
