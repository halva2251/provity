"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type TodoPriority = "niedrig" | "mittel" | "hoch";

export type Todo = {
  id: string;
  title: string;
  priority: TodoPriority;
  is_done: boolean;
};

const VALID_PRIORITIES: TodoPriority[] = ["niedrig", "mittel", "hoch"];

export async function createTodo(formData: FormData) {
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  const priority = formData.get("priority") as string;

  if (!title) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("todos").insert({
    user_id: user.id,
    title,
    priority: VALID_PRIORITIES.includes(priority as TodoPriority) ? priority : "mittel",
  });

  revalidatePath("/todos");
}

export async function toggleTodo(id: string, isDone: boolean) {
  const supabase = await createClient();

  await supabase.from("todos").update({ is_done: isDone }).eq("id", id);

  revalidatePath("/todos");
}

export async function updateTodoPriority(id: string, priority: TodoPriority) {
  const supabase = await createClient();

  if (!VALID_PRIORITIES.includes(priority)) {
    return;
  }

  await supabase.from("todos").update({ priority }).eq("id", id);

  revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();

  await supabase.from("todos").delete().eq("id", id);

  revalidatePath("/todos");
}
