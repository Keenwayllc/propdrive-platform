-- 011 — Editable hero copy for the functional pages (Properties, Open Houses,
-- Home Valuation, Mortgage). Apply: supabase db execute --file schema/011_page_heros.sql
-- Safe to re-run: every column guarded with IF NOT EXISTS.
--
-- All default to '' so existing rows look unchanged — each page falls back to its
-- original hardcoded copy whenever the column is blank.

alter table public.site_settings
  add column if not exists properties_eyebrow   text not null default '',
  add column if not exists properties_title     text not null default '',
  add column if not exists openhouses_eyebrow   text not null default '',
  add column if not exists openhouses_title     text not null default '',
  add column if not exists openhouses_subtitle  text not null default '',
  add column if not exists valuation_eyebrow    text not null default '',
  add column if not exists valuation_title      text not null default '',
  add column if not exists valuation_subtitle   text not null default '',
  add column if not exists mortgage_eyebrow     text not null default '',
  add column if not exists mortgage_title       text not null default '',
  add column if not exists mortgage_subtitle    text not null default '';
