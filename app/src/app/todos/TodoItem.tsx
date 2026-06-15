"use client";

import { deleteTodo, toggleTodo, updateTodoPriority, type Todo, type TodoPriority } from "./actions";

const PRIORITY_LABELS: Record<TodoPriority, string> = {
  niedrig: "Niedrig",
  mittel: "Mittel",
  hoch: "Hoch",
};

const PRIORITY_STYLES: Record<TodoPriority, string> = {
  niedrig: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
  mittel: "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  hoch: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
};

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-black/[.08] bg-white px-4 py-3 dark:border-white/[.145] dark:bg-zinc-950">
      <input
        type="checkbox"
        checked={todo.is_done}
        onChange={(e) => toggleTodo(todo.id, e.target.checked)}
        className="h-4 w-4 shrink-0"
        aria-label="Als erledigt markieren"
      />

      <span
        className={`flex-1 text-sm text-black dark:text-zinc-50 ${
          todo.is_done ? "text-zinc-400 line-through dark:text-zinc-600" : ""
        }`}
      >
        {todo.title}
      </span>

      <select
        value={todo.priority}
        onChange={(e) => updateTodoPriority(todo.id, e.target.value as TodoPriority)}
        className={`rounded-full px-3 py-1 text-xs font-medium outline-none ${PRIORITY_STYLES[todo.priority]}`}
        aria-label="Priorität"
      >
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        onClick={() => deleteTodo(todo.id)}
        className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        aria-label="Todo löschen"
      >
        Löschen
      </button>
    </li>
  );
}
