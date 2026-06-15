import Link from "next/link";

import { logout } from "./login/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-4 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Willkommen bei ProVity
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Angemeldet als {user?.email}
      </p>
      <Link
        href="/todos"
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Zu meinen Todos
      </Link>

      <form>
        <button
          formAction={logout}
          className="rounded-full border border-black/[.08] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Abmelden
        </button>
      </form>
    </div>
  );
}
