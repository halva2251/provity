import Link from "next/link";
import type { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  /** Emoji als schlichtes Icon — kein zusätzliches Icon-Paket nötig. */
  icon: string;
  /** Tailwind-Klassen für den farbigen Icon-Chip (visuelle Hierarchie). */
  accent: string;
  /** Ziel-Modulseite, auf die die Karte verlinkt. */
  href: string;
  linkLabel: string;
  /** Prominente Kennzahl oben rechts. */
  total: ReactNode;
  totalLabel: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wiederverwendbare Übersichtskarte für das Dashboard (Notizen, Todos,
 * Pomodoro). Rein präsentational — die Daten werden in der Server Component
 * geladen und als Props/Children hereingereicht.
 */
export function SummaryCard({
  title,
  icon,
  accent,
  href,
  linkLabel,
  total,
  totalLabel,
  children,
  className,
}: SummaryCardProps) {
  return (
    <section
      className={`flex flex-col gap-5 rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/[.145] dark:bg-zinc-950 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${accent}`}
          >
            {icon}
          </span>
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
            {title}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold leading-none text-black dark:text-zinc-50">
            {total}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {totalLabel}
          </div>
        </div>
      </div>

      <div className="flex-1">{children}</div>

      <Link
        href={href}
        className="text-sm font-medium text-black underline-offset-4 hover:underline dark:text-zinc-50"
      >
        {linkLabel} →
      </Link>
    </section>
  );
}
