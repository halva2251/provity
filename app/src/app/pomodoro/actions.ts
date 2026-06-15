"use server";

import { revalidatePath } from "next/cache";

import { DEFAULT_DURATION_MINUTES } from "@/lib/pomodoro";
import { createClient } from "@/lib/supabase/server";

// Speichert eine abgeschlossene Pomodoro-Session. Die Dauer wird bewusst NICHT
// vom Client übernommen, sondern serverseitig aus der Konstante gesetzt — so
// kann der Browser keine beliebigen Werte (z.B. 99999 Minuten) persistieren.
export async function logSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Durch proxy.ts (Auth-Guard) eigentlich ausgeschlossen; defensiv abgesichert
    // und als Fehler an den Client gemeldet, statt still zu verschlucken.
    throw new Error("Nicht angemeldet.");
  }

  const { error } = await supabase.from("pomodoro_sessions").insert({
    user_id: user.id,
    duration_minutes: DEFAULT_DURATION_MINUTES,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/pomodoro");
  // Das Dashboard zeigt denselben Zähler — ebenfalls neu validieren.
  revalidatePath("/dashboard");
}
