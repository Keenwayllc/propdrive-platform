-- 008 — About page CTA copy (editable from the Website Editor)
-- Apply: supabase db execute --file schema/008_about_cta.sql
-- Safe to re-run: all statements guarded with IF NOT EXISTS.
--
-- Empty defaults on purpose: the public About page falls back to sensible,
-- agent-aware copy when a field is blank, so nothing looks empty out of the box.

alter table public.site_settings
  add column if not exists about_cta_title  text not null default '',
  add column if not exists about_cta_text   text not null default '',
  add column if not exists about_cta_button text not null default '';
