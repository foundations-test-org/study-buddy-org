-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  flashcards jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- The app only ever talks to Supabase from server-side route handlers using the
-- service role key (see lib/supabase-server.ts), which bypasses RLS. Keeping RLS
-- on with no policies means the anon/public key -- which this app never uses --
-- has no access to the table.
alter table decks enable row level security;
