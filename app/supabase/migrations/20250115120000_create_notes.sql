-- Migration: create_notes
-- Pfad: app/supabase/migrations/20250115120000_create_notes.sql
--
-- Begründung RLS-Policies (A-1 / A-9):
--   Jeder Nutzer darf ausschliesslich seine eigenen Zeilen lesen, erstellen,
--   bearbeiten und löschen. Die Kombination von `using` (Lesezugriff) und
--   `with check` (Schreibzugriff) stellt sicher, dass ein authentifizierter
--   Nutzer nie auf Daten eines anderen Nutzers zugreifen kann – selbst dann
--   nicht, wenn er die UUID einer fremden Notiz kennt.

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notes enable row level security;

create index notes_user_id_idx on notes (user_id);

-- Trigger: updated_at automatisch auf now() setzen bei jedem UPDATE.
-- Ohne diesen Trigger müsste updated_at in jeder Server Action manuell
-- gesetzt werden – das ist fehleranfällig und wurde im Issue-Template vergessen.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_set_updated_at
  before update on notes
  for each row
  execute function set_updated_at();

-- RLS Policies
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
