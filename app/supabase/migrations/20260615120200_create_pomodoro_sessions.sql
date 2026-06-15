-- Migration: pomodoro_sessions-Tabelle + RLS
-- Feature: feature/pomodoro (Issue #7)
-- Abgeschlossene Sessions sind unveränderlich (Historie) -> nur select + insert.

create table pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_minutes integer not null,
  completed_at timestamptz not null default now()
);

alter table pomodoro_sessions enable row level security;

create index pomodoro_sessions_user_id_idx on pomodoro_sessions (user_id);

create policy "Users can view their own sessions"
  on pomodoro_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own sessions"
  on pomodoro_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Bewusst kein update/delete: Historie bleibt unveränderlich.
