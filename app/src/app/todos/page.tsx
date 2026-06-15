import { createClient } from "@/lib/supabase/server";

import { createTodo, type Todo, type TodoPriority } from "./actions";
import { TodoItem } from "./TodoItem";

const PRIORITY_ORDER: Record<TodoPriority, number> = {
  hoch: 0,
  mittel: 1,
  niedrig: 2,
};

export default async function TodosPage() {
  const supabase = await createClient();

  const { data: todos } = await supabase
    .from("todos")
    .select("id, title, priority, is_done")
    .order("created_at", { ascending: false });

  const alle = (todos ?? []) as Todo[];
  const offene = alle
    .filter((todo) => !todo.is_done)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const erledigte = alle.filter((todo) => todo.is_done);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Todos</h1>

        <form className="flex flex-col gap-3 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Titel
            <input
              name="title"
              type="text"
              required
              className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Priorität
            <select
              name="priority"
              defaultValue="mittel"
              className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black outline-none focus:border-black/40 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
            >
              <option value="niedrig">Niedrig</option>
              <option value="mittel">Mittel</option>
              <option value="hoch">Hoch</option>
            </select>
          </label>

          <button
            formAction={createTodo}
            className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Todo erstellen
          </button>
        </form>

        {alle.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Du hast noch keine Todos. Erstelle dein erstes Todo oben.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
              {offene.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>

            {erledigte.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Erledigt</h2>
                <ul className="flex flex-col gap-2">
                  {erledigte.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
