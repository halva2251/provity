// Pfad: app/src/app/notes/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function createNote(formData: FormData) {
  const supabase = await createClient();

  // user_id muss explizit mitgegeben werden, da die RLS-Policy es prüft.
  // Ohne user_id schlägt der Insert wegen NOT NULL fehl.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const { error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.id });

  if (error) {
    redirect(`/notes?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // updated_at wird automatisch vom Datenbank-Trigger gesetzt – kein manuelles Setzen nötig.
  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);

  if (error) {
    redirect(`/notes/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect("/notes");
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    redirect(`/notes?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/notes");
  redirect("/notes");
}
