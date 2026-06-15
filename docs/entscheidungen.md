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
Pull Request und Push auf `main` Lint, TypeScript-Check, eine Prüfung der
Supabase-Umgebungsvariablen sowie den Produktions-Build ausführt. Ergänzt durch
Vercel Preview-Deployments pro Pull Request (automatisch via GitHub-Integration).
Begründung: verhindert, dass kaputter Code in `main` gelangt; liefert
nachvollziehbare Qualitätssicherung für A-10/A-11 und sofort testbare Preview-
Links für die Demo.

## Branch-Modell: kein `dev`-Branch

Frühe Planungsnotizen (STRATEGY.md, CLAUDE.md) erwähnten ein `dev`-`main`-Modell
mit Feature-Branches gegen `dev`. In der Praxis liefen alle bisherigen PRs
(#1–#4) bereits direkt gegen `main` — ein `dev`-Branch wurde nie angelegt.
Entscheid: bei einem Single-Branch-Modell bleiben (Feature-Branches direkt
gegen `main`, PR + Review vor Merge). Begründung: für ein 3–5-köpfiges Team
mit kurzer Projektdauer reduziert ein zusätzlicher Integrations-Branch nur
die Übersicht, ohne einen echten Mehrwert zu bieten — das bestehende
PR-Review-Gate auf `main` erfüllt denselben Zweck (A-11). Die Planungsdokumente
und CI-Konfiguration wurden entsprechend korrigiert.

## Build-Reihenfolge

Notizen → Todos → Pomodoro → Dashboard, da das Dashboard die Daten der
anderen drei Module aggregiert und somit zuletzt sinnvoll ist.

## Datenbank-Schema & RLS-Design (Notes / Todos / Pomodoro)

Die drei Feature-Tabellen liegen als versionierte SQL-Migrationen unter
`app/supabase/migrations/` und werden im Supabase SQL Editor ausgeführt.

**RLS-Policy-Muster (alle Tabellen):** Pro Operation eine eigene Policy
(`select`/`insert`/`update`/`delete`) mit `auth.uid() = user_id`. Begründung
(A-1/A-9): Datenisolation muss auf DB-Ebene erzwungen werden, nicht nur im
Anwendungscode — selbst bei einem Bug in einer Server Action kann ein Nutzer
keine fremden Datensätze lesen oder ändern. Verworfen: Filterung nur in der
Applikation (kein echter Schutz, eine vergessene `where`-Klausel reicht für ein
Datenleck).

**Drei bewusste Optimierungen gegenüber dem "Minimal-SQL" aus den Issues**
(Supabase-Best-Practices, verhaltensneutral):
1. `(select auth.uid())` statt blankem `auth.uid()` — Postgres wertet den Wert
   einmal pro Query aus (initPlan) statt einmal pro Zeile. RLS-Performance.
2. `to authenticated` auf jeder Policy — anonyme Requests werden gar nicht erst
   gegen die Policy geprüft.
3. `create index ... (user_id)` pro Tabelle — `user_id` wird bei jeder
   Listen-Query und jeder RLS-Prüfung gefiltert; der Fremdschlüssel wäre sonst
   nicht indexiert.
   Zusätzlich enthält die `update`-Policy ein `with check`, damit ein Nutzer die
   `user_id` einer eigenen Zeile nicht auf eine fremde umschreiben kann.

**Todos — Priorität als Enum (`todo_priority`) statt `text`:** Die drei Stufen
(niedrig/mittel/hoch) sind fest und endlich. Ein Enum erzwingt gültige Werte auf
DB-Ebene und macht ungültige Zustände unmöglich. Verworfen: `text` mit
Check-Constraint (gleicher Effekt, aber umständlicher) bzw. `text` ohne
Constraint (erlaubt Tippfehler/ungültige Werte). Trade-off bewusst akzeptiert:
Enum-Werte später zu entfernen ist aufwändig — für drei stabile Stufen
unkritisch.

**Pomodoro — nur `select` + `insert`, kein `update`/`delete`:** Abgeschlossene
Sessions sind ein unveränderliches Historien-Log (Grundlage für die
Dashboard-Statistik). Fehlende Policies = Operation für niemanden erlaubt, d.h.
Sessions können nach dem Anlegen nicht mehr verändert oder gelöscht werden.

**Dashboard — keine eigene Tabelle/Policy:** Das Dashboard liest rein lesend aus
`notes`, `todos`, `pomodoro_sessions`. RLS gilt für *jede* Query gegen diese
Tabellen, nicht nur für die ursprünglichen Module — die Datenisolation greift
also automatisch, ohne zusätzlichen Code.

<!-- Anleitung: jede relevante Entscheidung sofort nach dem Treffen eintragen,
nicht rückwirkend rekonstruieren. -->
