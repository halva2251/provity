-- Migration: Tabellen-Privilegien an die Rolle `authenticated` vergeben
-- Fix: "permission denied for table notes/todos" (PostgreSQL 42501)
--
-- Ursache: RLS (enable row level security + Policies) steuert nur, WELCHE
-- ZEILEN eine Rolle sieht/ändert. Davor prüft PostgreSQL aber die klassischen
-- Tabellen-Privilegien (GRANT). Fehlen diese, scheitert der Zugriff bereits vor
-- der RLS-Auswertung mit 42501 "permission denied for table" – unabhängig von
-- den Policies.
--
-- In diesem Projekt wurden die Tabellen ohne GRANTs angelegt, und das gehärtete
-- Supabase-Setup vergibt keine automatischen Default-Privilegien an die API-Rolle
-- `authenticated`. Darum hier explizit nachziehen.
--
-- Least Privilege: nur `authenticated` (alle Policies sind `to authenticated`),
-- und nur die Operationen, die jede Tabelle per Policy tatsächlich erlaubt.
-- `anon` erhält bewusst nichts – ohne Login kein Datenzugriff.
--
-- Eigene Migration (append-only Historie, analog zur updated_at-Trigger-Migration):
-- auf der bestehenden DB muss nur diese eine Datei nachgezogen werden.

-- notes: voller CRUD-Zugriff (select/insert/update/delete-Policies vorhanden)
grant select, insert, update, delete on table notes to authenticated;

-- todos: voller CRUD-Zugriff (select/insert/update/delete-Policies vorhanden)
grant select, insert, update, delete on table todos to authenticated;

-- pomodoro_sessions: Historie ist unveränderlich -> nur select + insert,
-- passend zu den dort definierten Policies (kein update/delete).
grant select, insert on table pomodoro_sessions to authenticated;

-- Defensiv: der updated_at-Trigger auf notes ruft beim UPDATE
-- extensions.moddatetime() auf. Da diesem Projekt-Setup auch die
-- Tabellen-GRANTs fehlten, kann ebenso die EXECUTE-/USAGE-Berechtigung im
-- extensions-Schema fehlen -> UPDATE würde sonst mit 42501 scheitern.
-- Idempotent und unschädlich, falls Supabase das bereits vergeben hat.
grant usage on schema extensions to authenticated;
grant execute on function extensions.moddatetime() to authenticated;
