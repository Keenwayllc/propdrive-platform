-- 009 — Homepage "Recent results" highlights (editable from the Website Editor)
-- Apply: supabase db execute --file schema/009_home_highlights.sql
-- Safe to re-run: all statements guarded with IF NOT EXISTS.
--
-- highlights_cards holds exactly three { icon, title, description, date } cards.
-- Defaults match the original hardcoded section so existing rows look unchanged.

alter table public.site_settings
  add column if not exists highlights_eyebrow   text  not null default '',
  add column if not exists highlights_title     text  not null default '',
  add column if not exists highlights_subtitle  text  not null default '',
  add column if not exists highlights_cards     jsonb not null default
    '[
      {"icon":"trending-up","title":"Sold over ask","description":"Bel Air · 9 days on market","date":"Closed last week"},
      {"icon":"sparkles","title":"Just listed","description":"Santa Monica · $4,200,000","date":"2 days ago"},
      {"icon":"handshake","title":"In escrow","description":"Pacific Palisades · 5 days","date":"Today"}
    ]'::jsonb;
