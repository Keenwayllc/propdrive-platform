-- 014 — Editable Terms of Service + Privacy Policy body copy.
-- Apply: supabase db execute --file schema/014_legal_pages.sql
-- Safe to re-run: every column guarded with IF NOT EXISTS.
--
-- Body is plain text; blank lines separate paragraphs when rendered. The
-- "*_updated" columns hold the owner's "Last updated" label. All default to ''
-- so the pages fall back to their template placeholder copy until edited.

alter table public.site_settings
  add column if not exists terms_body      text not null default '',
  add column if not exists terms_updated   text not null default '',
  add column if not exists privacy_body    text not null default '',
  add column if not exists privacy_updated text not null default '';
