-- Migration: updated_at-Trigger für die notes-Tabelle
-- Feature: feature/notes (Issue #5)
--
-- Die notes-Tabelle setzt updated_at nur per `default now()` beim INSERT.
-- Ohne Trigger bliebe updated_at bei jeder Bearbeitung auf dem Erstelldatum
-- stehen ("Zuletzt bearbeitet" wäre falsch). Dieser Trigger aktualisiert
-- updated_at automatisch bei jedem UPDATE.
--
-- Eigene Migration (statt Änderung der bereits angewandten
-- 20260615120000_create_notes.sql), damit die Migrationshistorie append-only
-- bleibt und nur diese eine Datei auf der bestehenden DB nachgezogen werden muss.

create extension if not exists moddatetime with schema extensions;

create trigger notes_updated_at
  before update on notes
  for each row
  execute procedure moddatetime(updated_at);
