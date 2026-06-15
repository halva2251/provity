"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { logSession } from "./actions";

type TimerStatus = "idle" | "running" | "paused" | "finished";

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

export function Timer({ durationMinutes }: { durationMinutes: number }) {
  const router = useRouter();
  const durationMs = durationMinutes * 60 * 1000;

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingMs, setRemainingMs] = useState(durationMs);

  // Zeitpunkt, zu dem der Timer ablaufen soll (Date.now()-Basis). Die verbleibende
  // Zeit wird daraus berechnet, statt einen Zähler zu dekrementieren — so entsteht
  // kein Drift durch ungenaue setInterval-Intervalle.
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTick();
    endTimeRef.current = null;
    setRemainingMs(0);
    setStatus("finished");
    playBeep();
    // Abgeschlossene Session speichern und Server-Zähler aktualisieren.
    void logSession(durationMinutes).then(() => router.refresh());
  }, [clearTick, durationMinutes, router]);

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

  // Interval beim Unmount aufräumen.
  useEffect(() => clearTick, [clearTick]);

  const handleStart = useCallback(() => {
    // Aus idle/finished neu starten, aus paused fortsetzen.
    const basisMs = status === "paused" ? remainingMs : durationMs;
    endTimeRef.current = Date.now() + basisMs;
    setRemainingMs(basisMs);
    setStatus("running");
    startTick();
  }, [status, remainingMs, durationMs, startTick]);

  const handlePause = useCallback(() => {
    if (status !== "running") {
      return;
    }
    clearTick();
    if (endTimeRef.current !== null) {
      setRemainingMs(Math.max(0, endTimeRef.current - Date.now()));
    }
    endTimeRef.current = null;
    setStatus("paused");
  }, [status, clearTick]);

  const handleReset = useCallback(() => {
    clearTick();
    endTimeRef.current = null;
    setRemainingMs(durationMs);
    setStatus("idle");
  }, [clearTick, durationMs]);

  const isFinished = status === "finished";
  const remainingSeconds = Math.round(remainingMs / 1000);

  return (
    <div
      className={`flex flex-col items-center gap-6 rounded-lg border bg-white p-8 dark:bg-zinc-950 ${
        isFinished
          ? "border-green-500 dark:border-green-500"
          : "border-black/[.08] dark:border-white/[.145]"
      }`}
    >
      <div
        className={`font-mono text-6xl font-semibold tabular-nums ${
          isFinished
            ? "text-green-600 motion-safe:animate-pulse dark:text-green-400"
            : "text-black dark:text-zinc-50"
        }`}
        role="timer"
        aria-live="polite"
      >
        {formatTime(remainingSeconds)}
      </div>

      {isFinished ? (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          Session abgeschlossen! Gut gemacht.
        </p>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {status === "running"
            ? "Timer läuft …"
            : status === "paused"
              ? "Pausiert"
              : `Bereit — ${durationMinutes} Minuten`}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={status === "running"}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
        >
          {status === "paused" ? "Weiter" : "Start"}
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
          disabled={status === "idle"}
          className="rounded-full border border-black/[.08] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
