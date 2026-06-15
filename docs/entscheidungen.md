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

## Pomodoro-Timer — UI- und Verhaltensentscheidungen

**Feste Dauer 25 Minuten (nicht konfigurierbar):** Die klassische Pomodoro-Länge
deckt den Kern des Features ab; eine konfigurierbare Dauer würde zusätzlichen
UI-State und Validierung erfordern, ohne den Lernzweck (Timer-Logik, Session-
Persistenz, RLS) zu erweitern. Die Dauer liegt als Konstante
`DEFAULT_DURATION_MINUTES` zentral in `app/src/lib/pomodoro.ts` und wird sowohl
für die Anzeige (Prop der Timer-Komponente) als auch serverseitig beim Speichern
verwendet — eine spätere Konfigurierbarkeit ist damit ein kleiner, isolierter
Schritt. Verworfen: konfigurierbare Dauer (Scope ohne Mehrwert für die DoD); im
Projektplan (`PLAN.md`) entsprechend als „fixed 25-min" nachgeführt.

**Drift-freie Zeitmessung über Ziel-Zeitstempel:** Der Timer berechnet die
verbleibende Zeit aus der Differenz zu einem gespeicherten End-Zeitstempel
(`Date.now()`), statt bei jedem `setInterval`-Tick einen Zähler zu dekrementieren.
Begründung (DoD): `setInterval` feuert nicht exakt im angegebenen Intervall; ein
reiner Zähler würde über 25 Minuten spürbar nachgehen. Das Tick-Intervall
(200 ms) dient nur der flüssigen Anzeige, nicht der Zeitrechnung. Beim Pausieren
wird die Restzeit festgehalten und beim Fortsetzen ein neuer End-Zeitstempel
berechnet.

**Schreibzugriff nur über Server Action:** Der Client ruft beim Ablauf die Server
Action `logSession()` auf; es gibt keinen direkten Supabase-Schreibzugriff im
Browser (Muster wie `app/src/app/login/actions.ts`). `getUser()` serverseitig
bindet die Session an den eingeloggten Nutzer, die `user_id` wird nie vom Client
übergeben — zusätzlich zur RLS-Absicherung. Auch die **Dauer wird nicht vom
Client übernommen**, sondern serverseitig aus `DEFAULT_DURATION_MINUTES` gesetzt,
damit kein manipulierter Aufruf beliebige Werte persistieren kann. Schlägt das
Speichern fehl, wird der Fehler im Timer sichtbar gemeldet (nicht still
verschluckt).

**Feedback bei Ablauf:** Visuell (grüner Rahmen, grüne Ziffern, Meldung
„Session abgeschlossen!") plus dezenter Beep via Web Audio API (best effort, ohne
externes Audio-Asset). Die Pulse-Animation ist mit `motion-safe:` versehen und
entfällt damit bei aktivem `prefers-reduced-motion`.

## Dashboard — Implementierung (Issue #8)

**Startbildschirm: `/` leitet auf `/dashboard` um.** Optionen waren (a) das
Dashboard direkt unter `/` rendern oder (b) eine eigene Route `/dashboard` und
`/` per `redirect()` dorthin schicken. Gewählt: (b). Begründung: Die Issues
listen `app/src/app/dashboard/page.tsx` als anzulegende Datei, und eine eigene,
benennbare Route ist verlinkbar/teilbar; `/` bleibt als stabiler Einstiegspunkt
nach dem Login (die `login`-Action redirectet weiterhin auf `/`). Verworfen:
Dashboard-Logik in `page.tsx` der Wurzel — vermischt "Einstiegspunkt" und
"Feature-Seite" und erschwert späteres Verlinken.

**Datenladen parallel statt sequenziell.** Alle fünf Übersichts-Queries (Notizen
+ Anzahl, offene Todos + Anzahl, erledigte Todos, Pomodoro gesamt, Pomodoro
heute) laufen in einem `Promise.all([...])`. Begründung: serielles `await` würde
einen Request-Wasserfall erzeugen (Summe der Latenzen); parallel zählt nur die
langsamste Query. Datenmenge wird klein gehalten über `count: "exact"` für
Summen (mit `head: true`, wo keine Zeilen gebraucht werden) und `limit(3)` für
die Listen — kein ungebremstes Laden aller Datensätze.

**Abhängigkeit zu #5/#6/#7.** Das Dashboard liest aus `notes`, `todos`,
`pomodoro_sessions` (Tabellen liegen bereits als Migrationen vor) und verlinkt
auf `/notes`, `/todos`, `/pomodoro`. Diese Modul-Seiten entstehen in den
parallelen Issues #5/#6/#7; bis zu deren Merge führen die Links ins Leere
(404) — die Dashboard-Logik selbst ist davon unabhängig korrekt und baut/
typprüft fehlerfrei (Next.js validiert `Link`-Ziele nicht zur Build-Zeit).

**"Heute" für Pomodoro: Serverzeit (UTC).** Die "heute abgeschlossen"-Zählung
nutzt `new Date().setHours(0,0,0,0)` auf dem Server. Auf Vercel läuft das auf
UTC; für Nutzer in der Schweiz bedeutet das, dass Sessions erst ab 02:00 Uhr
Ortszeit als "heute" gezählt werden. Bewusst akzeptiert für die erste Version,
da eine korrekte clientseitige Zeitzonenbehandlung zusätzliche Komplexität
bedeutet; falls nötig, wird dies in einem Folgeschritt über einen
Zeitzonen-Offset aus dem Client gelöst.

<!-- Anleitung: jede relevante Entscheidung sofort nach dem Treffen eintragen,
nicht rückwirkend rekonstruieren. -->
