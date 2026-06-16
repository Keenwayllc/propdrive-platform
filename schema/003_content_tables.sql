-- 003 — content tables: stats column, testimonials, neighborhoods
-- Apply: supabase db execute --file schema/003_content_tables.sql

alter table public.site_settings
  add column if not exists stats jsonb not null default
  '[{"value":127,"suffix":"","label":"Homes closed"},{"value":11,"suffix":"","label":"Avg. days on market"},{"value":98.2,"suffix":"%","label":"Of list price"}]'::jsonb;

-- testimonials ----------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  quote         text not null,
  author_name   text not null,
  author_detail text not null default '',
  sort_order    integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at
  before update on public.testimonials for each row execute function public.set_updated_at();
create index if not exists idx_testimonials_sort on public.testimonials (sort_order);
alter table public.testimonials enable row level security;
drop policy if exists "public read active testimonials" on public.testimonials;
create policy "public read active testimonials" on public.testimonials for select using (active = true);
drop policy if exists "auth manage testimonials" on public.testimonials;
create policy "auth manage testimonials" on public.testimonials for all to authenticated using (true) with check (true);

-- neighborhoods ---------------------------------------------------------------
create table if not exists public.neighborhoods (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  image_url   text not null default '',
  blurb       text not null default '',
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_neighborhoods_updated_at on public.neighborhoods;
create trigger trg_neighborhoods_updated_at
  before update on public.neighborhoods for each row execute function public.set_updated_at();
create index if not exists idx_neighborhoods_sort on public.neighborhoods (sort_order);
alter table public.neighborhoods enable row level security;
drop policy if exists "public read active neighborhoods" on public.neighborhoods;
create policy "public read active neighborhoods" on public.neighborhoods for select using (active = true);
drop policy if exists "auth manage neighborhoods" on public.neighborhoods;
create policy "auth manage neighborhoods" on public.neighborhoods for all to authenticated using (true) with check (true);

-- Seeds -----------------------------------------------------------------------
insert into public.testimonials (quote, author_name, author_detail, sort_order)
select * from (values
  ('Priya found us a Westwood condo before it ever hit the market. Calm, sharp, and three steps ahead the whole way.', 'Priya Raghunathan', 'Bought in Westwood', 1),
  ('Sold our Bel Air home in nine days, over ask. The staging advice and pricing were exactly right.', 'Marcus Delacroix', 'Sold in Bel Air', 2),
  ('First-time buyers and totally overwhelmed, until we had someone who actually knew Santa Monica block by block.', 'Elena Vasquez-Moreau', 'Bought in Santa Monica', 3)
) as t(quote, author_name, author_detail, sort_order)
where not exists (select 1 from public.testimonials);

insert into public.neighborhoods (name, slug, image_url, blurb, sort_order)
select * from (values
  ('Beverly Hills','beverly-hills','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80','Iconic estates, the flats, and the world-famous 90210 address.',1),
  ('Bel Air','bel-air','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80','Gated privacy and trophy homes above the city.',2),
  ('Santa Monica','santa-monica','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80','Beach-close living, walkable, and bright year-round.',3),
  ('Malibu','malibu','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80','Twenty-seven miles of coastline, canyons, and ocean views.',4),
  ('Westwood','westwood','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80','Village energy next to UCLA and the Wilshire corridor.',5),
  ('Pacific Palisades','pacific-palisades','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80','Village charm, ocean bluffs, and deep family roots.',6),
  ('Calabasas','calabasas','https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80','Hidden Hills luxury and gated valley estates.',7),
  ('Brentwood','brentwood','https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80','Quiet, leafy, and effortlessly upscale.',8),
  ('Encino','encino','https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80','Spacious San Fernando Valley living with great value.',9)
) as t(name, slug, image_url, blurb, sort_order)
where not exists (select 1 from public.neighborhoods);
