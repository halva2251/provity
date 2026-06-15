import { DEFAULT_DURATION_MINUTES } from "@/lib/pomodoro";
import { createClient } from "@/lib/supabase/server";

import { Timer } from "./Timer";

export default async function PomodoroPage() {
  const supabase = await createClient();

  // Beginn des heutigen Tages (Serverzeit) für den Tages-Zähler. Konsistent mit
  // dem Dashboard; zur UTC-Einschränkung siehe docs/entscheidungen.md.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayIso = startOfToday.toISOString();

  // Beide Zähler-Queries parallel (kein Wasserfall), konsistent mit dem
  // Dashboard. RLS stellt sicher, dass nur eigene Sessions gezählt werden.
  const [gesamtRes, heuteRes] = await Promise.all([
    supabase
      .from("pomodoro_sessions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("pomodoro_sessions")
      .select("id", { count: "exact", head: true })
      .gte("completed_at", startOfTodayIso),
  ]);

  const gesamt = gesamtRes.count ?? 0;
  const heute = heuteRes.count ?? 0;

  // Fehler sichtbar machen, statt sie als leeren Zähler ("0 Sessions") zu
  // kaschieren — konsistent mit dashboard/page.tsx.
  const queryError = gesamtRes.error ?? heuteRes.error;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Pomodoro</h1>

        {queryError ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            Zähler konnten nicht geladen werden. Bitte versuche es später erneut.
          </p>
        ) : (
          <div className="flex flex-col gap-1 rounded-lg border border-black/[.08] bg-white p-6 text-sm text-zinc-700 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-300">
            <p>
              Heute{" "}
              <span className="font-semibold text-black dark:text-zinc-50">{heute}</span>{" "}
              {heute === 1 ? "Session" : "Sessions"} abgeschlossen
            </p>
            <p className="text-zinc-500 dark:text-zinc-400">
              Insgesamt {gesamt} {gesamt === 1 ? "Session" : "Sessions"}
            </p>
          </div>
        )}

        <Timer durationMinutes={DEFAULT_DURATION_MINUTES} />
      </div>
    </div>
  );
}
