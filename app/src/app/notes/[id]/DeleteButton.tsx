// Pfad: app/src/app/notes/[id]/DeleteButton.tsx
// Muss ein Client Component sein, weil confirm() nur im Browser verfügbar ist.
"use client";

import { deleteNote } from "../actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteNote}
      onSubmit={(e) => {
        if (
          !confirm(
            "Notiz wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-300 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
      >
        Löschen
      </button>
    </form>
  );
}
