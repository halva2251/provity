// Pfad: app/src/app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { updateNote } from "../actions";
import DeleteButton from "./DeleteButton";

export default async function NoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: paramError } = await searchParams;
  const supabase = await createClient();

  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  // Notiz nicht gefunden oder gehört einem anderen Nutzer (RLS gibt null zurück)
  if (!note) {
    notFound();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="flex w-full max-w-lg flex-col gap-6 py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/notes"
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            ← Zurück
          </Link>
          <span className="text-xs text-zinc-400">
            Zuletzt bearbeitet:{" "}
            {new Date(note.updated_at).toLocaleDateString("de-CH", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        {paramError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {paramError}
          </p>
        )}

        <form className="flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
            Notiz bearbeiten
          </h1>

          <input type="hidden" name="id" value={note.id} />

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Titel
            <input
              name="title"
              type="text"
              required
              defaultValue={note.title}
              className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Inhalt
            <textarea
              name="content"
              rows={6}
              defaultValue={note.content}
              className="resize-none rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            />
          </label>

          <div className="mt-2 flex items-center justify-between">
            <button
              formAction={updateNote}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Speichern
            </button>
          </div>
        </form>

        {/* Ausserhalb des Bearbeiten-Formulars: verschachtelte <form> sind
            ungültiges HTML und würden das Löschen unterbrechen. */}
        <div className="flex justify-end">
          <DeleteButton id={note.id} />
        </div>
      </div>
    </div>
  );
}
