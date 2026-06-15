-- Migration: notes-Tabelle + Row Level Security
-- Feature: feature/notes (Issue #5)
-- Datenisolation: jeder Nutzer sieht/bearbeitet ausschliesslich eigene Notizen.

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notes enable row level security;

-- user_id wird bei jeder Liste/RLS-Prüfung gefiltert -> FK indexieren.
create index notes_user_id_idx on notes (user_id);

-- RLS-Policies: (select auth.uid()) wird einmal pro Query ausgewertet (initPlan),
-- `to authenticated` überspringt anonyme Requests vollständig.
create policy "Users can view their own notes"
  on notes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own notes"
  on notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own notes"
  on notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own notes"
  on notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);
