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

<!-- Anleitung: Pro Feature führt zusätzlich jede Person ihre eigenen AI-Anfragen
nach (siehe Hinweis in den Issues). Diese hier zentral zusammenführen. -->
