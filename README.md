# ProVity

All-in-One Produktivitäts-App — Modul 306 (LB306-V1) Projekt

Pomodoro-Timer, Notizen, Todo-Liste und Dashboard in einer PWA, gebaut mit
Next.js, TypeScript, Tailwind CSS und Supabase.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Row Level Security)
- Vercel (Hosting)

## Projektstruktur

```
provity/
├── app/                 ← Next.js-App (Source of Truth für den Code)
│   └── src/
│       ├── app/         ← Routen (App Router)
│       └── lib/         ← Hilfsfunktionen, Supabase-Clients
├── docs/                ← Projektdokumentation (IPERKA, Zeitplan, Testkonzept, ...)
├── PLAN.md              ← Projektplan und Phasenübersicht
└── README.md            ← diese Datei
```

## Setup (lokal)

```bash
cd app
npm install
cp .env.local.example .env.local   # Supabase-Keys eintragen
npm run dev
```

Benötigte Umgebungsvariablen (`app/.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Dokumentation

Siehe [`docs/`](./docs) für Zeitplan, Testkonzept, Entscheidungslog,
Arbeitsjournal und AI-Log.
