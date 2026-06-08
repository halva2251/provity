# Entscheidungslog — ProVity

> A-1/A-9: Entscheide nachvollziehbar dokumentieren — Optionen, Kriterien,
> gewählte Variante, Begründung, verworfene Alternativen.

## Tech-Stack

| Bereich | Wahl | Begründung | Verworfene Alternativen |
|---------|------|------------|--------------------------|
| Frontend/Backend | Next.js 16 (App Router) + TypeScript | Eine Codebasis für UI und API-Routes; aktuelle Version zum Zeitpunkt des Setups (Projektantrag nannte ursprünglich 14 — siehe Hinweis unten) | Express.js-Backend (unnötiger Overhead) |
| Styling | Tailwind CSS | Schnell, konsistent, gute Next.js-Integration | — |
| Datenbank/Auth | Supabase (PostgreSQL) | Kostenloses Tier, eingebaute Auth, Row Level Security für Datenisolation | Firebase (Vendor Lock-in, weniger SQL-Kontrolle) |
| Hosting | Vercel | Kostenlos, automatische Deploys aus GitHub | — |
| Mobile | PWA | Eine Codebasis statt nativer Apps für iOS/Android | React Native/Expo (zwei Codebasen, zu komplex für Zeitrahmen) |

## Hinweis: Next.js Versions-Update (14 → 16)

Beim Scaffolding mit `create-next-app@latest` wurde Next.js 16.2.7 installiert
statt der im Projektantrag genannten Version 14. Entscheid: aktuelle Version
beibehalten (aktuelle Dokumentation, kein Migrationsaufwand später) statt auf
14 zu pinnen. Wichtigste Änderung: `middleware` wurde in `proxy` umbenannt
(gleiche Funktionalität, neue Datei-Konvention `proxy.ts`).

## Supabase API-Key-Format

Das Projekt nutzt das neue Supabase-Schlüsselformat (`sb_publishable_...` /
`sb_secret_...`) statt der älteren JWT-basierten `anon`/`service_role`-Keys.
Datenisolation wird über Row Level Security (RLS) sichergestellt; "Automatically
expose new tables" wurde bewusst deaktiviert, RLS-Policies werden pro Tabelle
explizit geschrieben.

## Containerisierung (Docker)

Entscheid: kein Docker. Begründung: Vercel baut und betreibt Next.js nativ
ohne Container; ein Dockerfile würde nur zusätzlichen Wartungsaufwand bringen
(Build-Zeiten, Lernaufwand) ohne Mehrwert für Deployment oder Team-Setup, da
`npm install` + `.env.local.example` bereits eine konsistente Dev-Umgebung
sicherstellen.

## CI/CD-Pipeline

Entscheid: GitHub Actions Workflow (`.github/workflows/ci.yml`), der bei jedem
Pull Request und Push auf `main`/`dev` Lint, TypeScript-Check, eine Prüfung der
Supabase-Umgebungsvariablen sowie den Produktions-Build ausführt. Ergänzt durch
Vercel Preview-Deployments pro Pull Request (automatisch via GitHub-Integration).
Begründung: verhindert, dass kaputter Code in `main`/`dev` gelangt; liefert
nachvollziehbare Qualitätssicherung für A-10/A-11 und sofort testbare Preview-
Links für die Demo.

## Build-Reihenfolge

Notizen → Todos → Pomodoro → Dashboard, da das Dashboard die Daten der
anderen drei Module aggregiert und somit zuletzt sinnvoll ist.

<!-- Anleitung: jede relevante Entscheidung sofort nach dem Treffen eintragen,
nicht rückwirkend rekonstruieren. -->
