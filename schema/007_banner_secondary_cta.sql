-- 007 — optional secondary CTA button per hero banner slide.
-- Additive + idempotent. Apply: supabase db execute --file schema/007_banner_secondary_cta.sql
--
-- A slide shows a second button only when secondary_cta_text is non-empty.
-- Leave it blank for a single, clean call to action on that slide.

alter table public.banners
  add column if not exists secondary_cta_text text not null default '';

alter table public.banners
  add column if not exists secondary_cta_link text not null default '/home-valuation';
