# AI-Log — ProVity

> **Zweck (LB-Vorgabe):** Alle Anfragen an künstliche Intelligenz müssen
> deklariert werden (siehe Aufgabenstellung: *"fremde Hilfe und kopierte
> Codeteile oder Vorlagen aus dem Internet müssen Sie mit Quellangabe
> deklarieren (auch alle Abfragen durch künstliche Intelligenz)"*).
> Dieses Log weist die AI-Nutzung transparent nach (relevant für A-2
> Wissensbeschaffung und A-8 Selbständiges Arbeiten).

## Eingesetzte Werkzeuge

| Werkzeug | Einsatzbereich |
|----------|----------------|
| Claude (Anthropic, via Claude Code) | Analyse der Aufgabenstellung, Stack-Beratung, Scaffolding-Hilfe, Code-Review, Dokumentationsentwürfe |

## Grundsätze zur AI-Nutzung in diesem Projekt

- KI wurde als **Hilfsmittel** eingesetzt (Recherche, Strukturvorschläge,
  Code-Review), nicht als Ersatz für die eigene Arbeit.
- **Bewertungsrelevante, persönliche Teile** (Arbeitsjournal, Reflexion/
  Schlusswort) werden vom Team selbst verfasst und **nicht** durch KI generiert.
- Übernommene Code- oder Textvorschläge werden geprüft, verstanden und an das
  Projekt angepasst, bevor sie verwendet werden.

## Anfragen-Log

> Jede neue, nennenswerte AI-Anfrage hier ergänzen. Spalte "Verwendet in"
> macht den Bezug zum Projektergebnis nachvollziehbar.

| Datum | Werkzeug | Anfrage (Zusammenfassung) | Verwendet in |
|-------|----------|---------------------------|--------------|
| 2026-05-04 | Claude | Aufgabenstellung LB306 analysieren, Bewertungskriterien erklären, Stack & Feature-Umfang empfehlen | Planungsphase (Projektantrag, PLAN.md) |
| 2026-06-08 | Claude | Next.js-Scaffold mit Supabase aufsetzen, `.env`/Client-Server-Trennung, CI-Pipeline strukturieren | Scaffold, CI (`app/`, `.github/workflows/ci.yml`) |
| 2026-06-08 | Claude | Supabase E-Mail/Passwort-Auth implementieren (Server Actions, Session-Handling) | Auth-Feature (`app/src/app/login`, `register`, `auth/confirm`) |
| 2026-06-08 | Claude | Code-Review & Security-Review des Auth-Features | Fix-Commit `d2d06b7` |
| 2026-06-08 | Claude | Feature-Issues (#5–#8) strukturieren, Schema- und RLS-Vorschläge | GitHub Issues Notizen/Todos/Pomodoro/Dashboard |
| 2026-06-15 | Claude | Projektdokumentation strukturieren (Architektur-/DB-Diagramme, Zeitplan-Gerüst, IPA-Berichtsstruktur, Glossar, Testprotokoll-Vorlage) | `docs/` |
| 2026-06-15 | Claude | SQL-Migrationen (notes/todos/pomodoro) gegen Supabase-Best-Practices prüfen & optimieren (`(select auth.uid())`, `to authenticated`, FK-Index, `with check`); Migrationsdateien anlegen, RLS-Entscheidung dokumentieren, Schema in Supabase verifizieren | `app/supabase/migrations/`, `docs/entscheidungen.md`, Issues #5–#7 |
| 2026-06-15 | Claude | Pomodoro-Feature (Issue #7) umsetzen: drift-freie Timer-Client-Komponente (Start/Pause/Reset, Ziel-Zeitstempel), Server Action zum Speichern abgeschlossener Sessions, Server-Component mit Tages-/Gesamt-Zähler; UI-Entscheidungen dokumentieren, Testkonzept aktualisieren | `app/src/app/pomodoro/`, `docs/entscheidungen.md`, `docs/testkonzept.md` |
| 2026-06-15 | Claude | Dashboard (Issue #8) umsetzen: Server Component mit parallelem Datenladen (`Promise.all`) aus notes/todos/pomodoro_sessions, wiederverwendbare `SummaryCard`, Leerzustände, `/`→`/dashboard`-Redirect; lint/tsc/build geprüft | Dashboard-Feature (`app/src/app/dashboard/`, `app/src/app/page.tsx`) |
| 2026-06-15 | Claude | Code-Review PR #14 (Pomodoro) + Fixes: Query-Fehler im Page sichtbar machen, Speicherfehler im Timer melden, Dauer serverseitig setzen (nicht vom Client), `finish()`-Doppelschutz, `aria-live` nur auf Status statt jedem Tick, `Math.ceil`-Anzeige, Konstante nach `lib/pomodoro.ts`, `PLAN.md` (Custom-Dauer descoped) | `app/src/app/pomodoro/`, `app/src/lib/pomodoro.ts`, `PLAN.md`, `docs/entscheidungen.md` |
| 2026-06-15 | Claude | Bug „permission denied for table" (Postgres 42501) bei Notizen/Todos diagnostizieren: fehlende Tabellen-GRANTs an Rolle `authenticated` (RLS allein genügt nicht); Korrektur-Migration mit `grant`-Statements erstellen, von database-reviewer + security-reviewer prüfen lassen | `app/supabase/migrations/20260615120400_grant_table_privileges.sql`, `docs/entscheidungen.md` |
| 2026-06-15 | Claude | UX-Nachbesserung: einheitlicher „Zurück zum Dashboard"-Link (Notizen/Todos/Pomodoro) + mitlaufender Pomodoro-Countdown auf dem Dashboard via localStorage-Persistenz (absoluter Ablaufzeitpunkt); TypeScript-Review der Hydration-/Persistenz-Logik | `app/src/lib/pomodoroTimer.ts`, `app/src/components/BackLink.tsx`, `app/src/app/dashboard/PomodoroLiveStatus.tsx`, `app/src/app/pomodoro/Timer.tsx` |

<!-- Anleitung: Pro Feature führt zusätzlich jede Person ihre eigenen AI-Anfragen
nach (siehe Hinweis in den Issues). Diese hier zentral zusammenführen. -->
