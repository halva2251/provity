"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function logSession(durationMinutes: number) {
  const supabase = await createClient();

  // Nur ganzzahlige, positive Dauern akzeptieren — der Wert kommt vom Client.
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase.from("pomodoro_sessions").insert({
    user_id: user.id,
    duration_minutes: durationMinutes,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/pomodoro");
  // Das Dashboard zeigt denselben Zähler — ebenfalls neu validieren.
  revalidatePath("/dashboard");
}
