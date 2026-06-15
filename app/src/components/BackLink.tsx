import Link from "next/link";

// Einheitlicher "Zurück zum Dashboard"-Link für die Feature-Seiten (Notizen,
// Todos, Pomodoro). An einer Stelle definiert, damit Stil und Ziel konsistent
// bleiben (DRY). Standardziel ist das Dashboard (= Startbildschirm).
export function BackLink({
  href = "/dashboard",
  label = "← Zurück zum Dashboard",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
    >
      {label}
    </Link>
  );
}
