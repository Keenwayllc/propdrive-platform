-- 006 — homepage hero banner slides (rotating hero slideshow).
-- Additive + idempotent. Apply: supabase db execute --file schema/006_banners.sql

create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null default '',
  title       text not null default '',
  subtitle    text not null default '',
  cta_text    text not null default '',
  cta_link    text not null default '/properties',
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_banners_updated_at on public.banners;
create trigger trg_banners_updated_at
  before update on public.banners for each row execute function public.set_updated_at();

create index if not exists idx_banners_sort on public.banners (sort_order);

alter table public.banners enable row level security;

drop policy if exists "public read active banners" on public.banners;
create policy "public read active banners" on public.banners for select using (active = true);

drop policy if exists "auth manage banners" on public.banners;
create policy "auth manage banners" on public.banners for all to authenticated using (true) with check (true);
