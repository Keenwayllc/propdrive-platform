-- 010 — Custom pages (owner-authored standalone pages at /p/[slug])
-- Apply: supabase db execute --file schema/010_custom_pages.sql
-- Safe to re-run: IF NOT EXISTS guards + idempotent policies.

create table if not exists public.pages (
  id              uuid primary key default gen_random_uuid(),
  title           text    not null,
  slug            text    not null unique,
  body            text    not null default '',
  cover_image_url text    not null default '',
  show_in_nav     boolean not null default false,
  show_in_footer  boolean not null default false,
  published       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_pages_updated_at on public.pages;
create trigger trg_pages_updated_at
  before update on public.pages for each row execute function public.set_updated_at();

create index if not exists idx_pages_sort on public.pages (sort_order, created_at);

alter table public.pages enable row level security;

-- Public site reads published pages only; authenticated dashboard manages all.
drop policy if exists "public read published pages" on public.pages;
create policy "public read published pages" on public.pages
  for select using (published = true);

drop policy if exists "auth manage pages" on public.pages;
create policy "auth manage pages" on public.pages
  for all to authenticated using (true) with check (true);
