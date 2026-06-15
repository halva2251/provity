// Pfad: app/src/app/notes/page.tsx
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { createNote } from "./actions";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { error: paramError } = await searchParams;

  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Meine Notizen
        </h1>

        {paramError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {paramError}
          </p>
        )}

        {/* Formular: Neue Notiz erstellen */}
        <form className="flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
          <h2 className="text-base font-medium text-black dark:text-zinc-50">
            Neue Notiz
          </h2>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Titel
            <input
              name="title"
              type="text"
              required
              placeholder="Titel eingeben …"
              className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Inhalt
            <textarea
              name="content"
              rows={3}
              placeholder="Inhalt eingeben …"
              className="resize-none rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            />
          </label>

          <button
            formAction={createNote}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Erstellen
          </button>
        </form>

        {/* Notizenliste */}
        <div className="flex flex-col gap-3">
          {!notes || notes.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Noch keine Notizen vorhanden. Erstelle deine erste Notiz oben.
            </p>
          ) : (
            notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex flex-col gap-1 rounded-lg border border-black/[.08] bg-white px-5 py-4 transition-colors hover:border-black/20 dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/30"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  {note.title}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(note.created_at).toLocaleDateString("de-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
