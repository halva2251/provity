-- Migration: todos-Tabelle + RLS
-- Feature: feature/todos (Issue #6)
-- Datenisolation pro Nutzer; Priorität als Enum.

create type todo_priority as enum ('niedrig', 'mittel', 'hoch');

create table todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  priority todo_priority not null default 'mittel',
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table todos enable row level security;

create index todos_user_id_idx on todos (user_id);

create policy "Users can view their own todos"
  on todos for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own todos"
  on todos for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own todos"
  on todos for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  to authenticated
  using ((select auth.uid()) = user_id);
