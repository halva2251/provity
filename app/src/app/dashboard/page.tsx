import Link from "next/link";

import { logout } from "../login/actions";
import { createClient } from "@/lib/supabase/server";
import { PomodoroLiveStatus } from "./PomodoroLiveStatus";
import { SummaryCard } from "./SummaryCard";

type RecentNote = { id: string; title: string; updated_at: string };
type TopTodo = {
  id: string;
  title: string;
  priority: "niedrig" | "mittel" | "hoch";
};

const priorityStyles: Record<TopTodo["priority"], string> = {
  hoch: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  mittel: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  niedrig: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const priorityLabels: Record<TopTodo["priority"], string> = {
  hoch: "Hoch",
  mittel: "Mittel",
  niedrig: "Niedrig",
};

const dateFormatter = new Intl.DateTimeFormat("de-CH", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function EmptyState({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      {text}{" "}
      <Link
        href={href}
        className="font-medium text-black underline dark:text-zinc-50"
      >
        {cta}
      </Link>
    </p>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Start des heutigen Tages (Serverzeit) für die "heute"-Pomodoro-Zählung.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayIso = startOfToday.toISOString();

  // Alle Übersichts-Queries laufen PARALLEL (Promise.all) statt nacheinander —
  // so entsteht kein Request-Wasserfall. Dank RLS liefert jede Query
  // automatisch nur die Datensätze des eingeloggten Nutzers (kein zusätzlicher
  // user_id-Filter im Code nötig). `count: "exact"` liefert die Gesamtzahl,
  // während `limit`/`head` die übertragene Datenmenge klein hält.
  const [
    notesRes,
    openTodosRes,
    doneTodosRes,
    pomodoroTotalRes,
    pomodoroTodayRes,
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("id, title, updated_at", { count: "exact" })
      .order("updated_at", { ascending: false })
      .limit(3),
    supabase
      .from("todos")
      .select("id, title, priority", { count: "exact" })
      .eq("is_done", false)
      .order("priority", { ascending: false })
      .limit(3),
    supabase
      .from("todos")
      .select("id", { count: "exact", head: true })
      .eq("is_done", true),
    supabase.from("pomodoro_sessions").select("id", {
      count: "exact",
      head: true,
    }),
    supabase
      .from("pomodoro_sessions")
      .select("id", { count: "exact", head: true })
      .gte("completed_at", startOfTodayIso),
  ]);

  const recentNotes = (notesRes.data ?? []) as RecentNote[];
  const notesCount = notesRes.count ?? 0;

  const topTodos = (openTodosRes.data ?? []) as TopTodo[];
  const openTodosCount = openTodosRes.count ?? 0;
  const doneTodosCount = doneTodosRes.count ?? 0;

  const pomodoroTotal = pomodoroTotalRes.count ?? 0;
  const pomodoroToday = pomodoroTodayRes.count ?? 0;

  // Fehler aus einer der parallelen Queries sichtbar machen, statt sie als
  // leere Übersicht ("0 Notizen") zu kaschieren.
  const queryError =
    notesRes.error ??
    openTodosRes.error ??
    doneTodosRes.error ??
    pomodoroTotalRes.error ??
    pomodoroTodayRes.error;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        {queryError && (
          <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            Dashboard-Daten konnten nicht geladen werden. Bitte versuche es
            später erneut.
          </p>
        )}

        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {dateFormatter.format(new Date())}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-black dark:text-zinc-50">
              Willkommen zurück
            </h1>
            {user?.email && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Angemeldet als {user.email}
              </p>
            )}
          </div>
          <form>
            <button
              formAction={logout}
              className="rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
            >
              Abmelden
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Notizen */}
          <SummaryCard
            title="Notizen"
            icon="📝"
            accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200"
            href="/notes"
            linkLabel="Alle Notizen"
            total={notesCount}
            totalLabel={notesCount === 1 ? "Notiz" : "Notizen"}
            className="md:col-span-2 xl:col-span-1"
          >
            {recentNotes.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link
                      href={`/notes/${note.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                    >
                      <span className="truncate font-medium text-black dark:text-zinc-50">
                        {note.title}
                      </span>
                      <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        {dateFormatter.format(new Date(note.updated_at))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                text="Noch keine Notizen."
                href="/notes"
                cta="Jetzt erstellen"
              />
            )}
          </SummaryCard>

          {/* Todos */}
          <SummaryCard
            title="Todos"
            icon="✅"
            accent="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200"
            href="/todos"
            linkLabel="Alle Todos"
            total={openTodosCount}
            totalLabel={`offen · ${doneTodosCount} erledigt`}
          >
            {topTodos.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {topTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="truncate text-black dark:text-zinc-50">
                      {todo.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[todo.priority]}`}
                    >
                      {priorityLabels[todo.priority]}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                text={
                  doneTodosCount > 0
                    ? "Alles erledigt — keine offenen Todos."
                    : "Noch keine Todos."
                }
                href="/todos"
                cta="Jetzt erstellen"
              />
            )}
          </SummaryCard>

          {/* Pomodoro */}
          <SummaryCard
            title="Pomodoro"
            icon="🍅"
            accent="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
            href="/pomodoro"
            linkLabel="Zum Timer"
            total={pomodoroToday}
            totalLabel="heute abgeschlossen"
          >
            {/* Läuft gerade ein Timer, zeigt PomodoroLiveStatus den Countdown;
                sonst die statischen Session-Zahlen (fallback). */}
            <PomodoroLiveStatus
              fallback={
                pomodoroTotal > 0 ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Insgesamt{" "}
                      <span className="font-semibold text-black dark:text-zinc-50">
                        {pomodoroTotal}
                      </span>{" "}
                      {pomodoroTotal === 1 ? "Session" : "Sessions"} abgeschlossen
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {pomodoroToday > 0
                        ? "Stark — weiter so!"
                        : "Heute noch keine Session — Zeit für Fokus."}
                    </p>
                  </div>
                ) : (
                  <EmptyState
                    text="Noch keine Sessions."
                    href="/pomodoro"
                    cta="Timer starten"
                  />
                )
              }
            />
          </SummaryCard>
        </div>
      </main>
    </div>
  );
}
