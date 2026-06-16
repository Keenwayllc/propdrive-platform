-- =============================================================================
-- PropDrive — Supabase schema migration
-- =============================================================================
-- Run this in the Supabase SQL Editor (or via `supabase db execute`) against a
-- fresh project. It is idempotent where practical (IF NOT EXISTS guards) so it
-- can be re-run safely during setup.
--
-- Tables: profiles, site_settings, brand_settings, properties, leads, appointments
-- Extras: updated_at triggers, helpful indexes, and a starter RLS policy set.
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- Shared updated_at trigger function ------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''  -- pin search_path (security: avoids mutable-path hijack)
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- profiles
-- =============================================================================
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  full_name   text not null default '',
  role        text not null default 'agent'
                check (role in ('agent', 'admin', 'staff')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- site_settings  (single-row table that powers public marketing copy)
-- =============================================================================
create table if not exists public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  company_name    text not null default 'PropDrive Realty',
  hero_title      text not null default '',
  hero_subtitle   text not null default '',
  primary_cta     text not null default 'Browse Listings',
  secondary_cta   text not null default 'Get a Home Valuation',
  about_title     text not null default '',
  about_text      text not null default '',
  buyer_text      text not null default '',
  seller_text     text not null default '',
  footer_text     text not null default '',
  contact_phone   text not null default '',
  contact_email   text not null default '',
  office_address  text not null default '',
  social_links    jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- brand_settings  (single-row table that powers visual identity / white-label)
-- =============================================================================
create table if not exists public.brand_settings (
  id               uuid primary key default gen_random_uuid(),
  logo_url         text,
  logo_light_url   text,
  favicon_url      text,
  primary_color    text not null default '#1d4ed8',
  secondary_color  text not null default '#0f172a',
  accent_color     text not null default '#f59e0b',
  hero_image_url   text,
  agent_photo_url  text,
  company_name     text not null default 'PropDrive Realty',
  agent_name       text not null default '',
  license_number   text not null default '',
  brokerage_name   text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists trg_brand_settings_updated_at on public.brand_settings;
create trigger trg_brand_settings_updated_at
  before update on public.brand_settings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- properties
-- =============================================================================
create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  address       text not null default '',
  city          text not null default '',
  state         text not null default '',
  zip           text not null default '',
  price         numeric(12,2) not null default 0,
  bedrooms      integer not null default 0,
  bathrooms     numeric(3,1) not null default 0,
  square_feet   integer not null default 0,
  lot_size      numeric(10,2),
  property_type text not null default 'single_family'
                  check (property_type in (
                    'single_family','condo','townhouse','multi_family','land','commercial'
                  )),
  status        text not null default 'active'
                  check (status in (
                    'active','pending','sold','coming_soon','off_market'
                  )),
  description   text not null default '',
  features      jsonb not null default '[]'::jsonb,
  image_urls    jsonb not null default '[]'::jsonb,
  map_address   text not null default '',
  featured      boolean not null default false,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_properties_active   on public.properties (active);
create index if not exists idx_properties_featured  on public.properties (featured);
create index if not exists idx_properties_city      on public.properties (city);
create index if not exists idx_properties_status    on public.properties (status);

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- =============================================================================
-- leads
-- =============================================================================
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  email             text not null,
  phone             text,
  lead_type         text not null default 'general'
                      check (lead_type in ('buyer','seller','general','valuation')),
  message           text,
  property_interest text,
  timeline          text,
  budget            text,
  address           text,
  preferred_contact text not null default 'email'
                      check (preferred_contact in ('email','phone','text')),
  status            text not null default 'new'
                      check (status in ('new','contacted','qualified','closed','lost')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_leads_status     on public.leads (status);
create index if not exists idx_leads_lead_type   on public.leads (lead_type);
create index if not exists idx_leads_created_at  on public.leads (created_at desc);

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- =============================================================================
-- appointments
-- =============================================================================
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid references public.leads(id) on delete set null,
  lead_name        text not null,
  email            text not null,
  phone            text,
  property         text,
  appointment_date date not null,
  appointment_time text not null,
  appointment_type text not null default 'showing'
                     check (appointment_type in (
                       'showing','consultation','valuation','open_house','call'
                     )),
  status           text not null default 'requested'
                     check (status in (
                       'requested','confirmed','completed','cancelled','no_show'
                     )),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_appointments_lead_id on public.appointments (lead_id);
create index if not exists idx_appointments_date     on public.appointments (appointment_date);
create index if not exists idx_appointments_status   on public.appointments (status);

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security (starter policies)
-- =============================================================================
-- Public site needs anon READ on properties + settings, and anon INSERT on
-- leads/appointments (the contact forms). Everything else is locked to
-- authenticated users. Tighten these in Phase 2 as auth roles are finalised.

alter table public.profiles       enable row level security;
alter table public.site_settings  enable row level security;
alter table public.brand_settings enable row level security;
alter table public.properties     enable row level security;
alter table public.leads          enable row level security;
alter table public.appointments   enable row level security;

-- Public read of marketing/listing data
drop policy if exists "public read site_settings"  on public.site_settings;
create policy "public read site_settings"  on public.site_settings  for select using (true);

drop policy if exists "public read brand_settings" on public.brand_settings;
create policy "public read brand_settings" on public.brand_settings for select using (true);

drop policy if exists "public read active properties" on public.properties;
create policy "public read active properties" on public.properties
  for select using (active = true);

-- Public can submit leads & appointment requests
drop policy if exists "public insert leads" on public.leads;
create policy "public insert leads" on public.leads for insert with check (true);

drop policy if exists "public insert appointments" on public.appointments;
create policy "public insert appointments" on public.appointments for insert with check (true);

-- Authenticated (dashboard) full access
drop policy if exists "auth all profiles" on public.profiles;
create policy "auth all profiles" on public.profiles
  for all to authenticated using (true) with check (true);

drop policy if exists "auth manage site_settings" on public.site_settings;
create policy "auth manage site_settings" on public.site_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "auth manage brand_settings" on public.brand_settings;
create policy "auth manage brand_settings" on public.brand_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "auth manage properties" on public.properties;
create policy "auth manage properties" on public.properties
  for all to authenticated using (true) with check (true);

drop policy if exists "auth manage leads" on public.leads;
create policy "auth manage leads" on public.leads
  for all to authenticated using (true) with check (true);

drop policy if exists "auth manage appointments" on public.appointments;
create policy "auth manage appointments" on public.appointments
  for all to authenticated using (true) with check (true);

-- =============================================================================
-- Seed singletons (one row each for settings tables)
-- =============================================================================
insert into public.site_settings (company_name, hero_title, hero_subtitle)
select 'California Realty Group',
       'Find the home that feels like arrival.',
       'Expert guidance for buyers and sellers across Los Angeles County.'
where not exists (select 1 from public.site_settings);

insert into public.brand_settings (company_name, agent_name, brokerage_name)
select 'California Realty Group', 'Marcus Rivera', 'California Realty Group'
where not exists (select 1 from public.brand_settings);

-- =============================================================================
-- Storage — public bucket for listing photos
-- =============================================================================
-- Anyone can read (public site); only authenticated agents can upload/manage.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "public read property images" on storage.objects;
create policy "public read property images" on storage.objects
  for select using (bucket_id = 'property-images');

drop policy if exists "auth upload property images" on storage.objects;
create policy "auth upload property images" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-images');

drop policy if exists "auth update property images" on storage.objects;
create policy "auth update property images" on storage.objects
  for update to authenticated using (bucket_id = 'property-images');

drop policy if exists "auth delete property images" on storage.objects;
create policy "auth delete property images" on storage.objects
  for delete to authenticated using (bucket_id = 'property-images');

-- =============================================================================
-- Integration settings — self-serve API keys entered from the dashboard
-- (e.g. OpenAI) so a non-technical owner can connect a service without editing
-- Vercel env vars. Single row. Because this holds a billable secret, RLS is
-- tighter than the data tables: admin-only (no anon, no non-admin), and the
-- client only ever receives a masked preview from server code.
-- =============================================================================
create table if not exists public.integration_settings (
  id smallint primary key default 1,
  openai_api_key text,
  updated_at timestamptz not null default now(),
  constraint integration_settings_single_row check (id = 1)
);

alter table public.integration_settings enable row level security;

-- Admin check helper (SECURITY DEFINER avoids RLS recursion on profiles).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from anon;

drop policy if exists "admin read integration settings" on public.integration_settings;
create policy "admin read integration settings" on public.integration_settings
  for select to authenticated using (public.is_admin());

drop policy if exists "admin insert integration settings" on public.integration_settings;
create policy "admin insert integration settings" on public.integration_settings
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin update integration settings" on public.integration_settings;
create policy "admin update integration settings" on public.integration_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Editable homepage content: stats, testimonials, neighborhoods
-- =============================================================================
-- Homepage headline stats (hero + reused on the page), owner-editable.
alter table public.site_settings
  add column if not exists stats jsonb not null default
  '[{"value":127,"suffix":"","label":"Homes closed"},{"value":11,"suffix":"","label":"Avg. days on market"},{"value":98.2,"suffix":"%","label":"Of list price"}]'::jsonb;

-- Testimonials -----------------------------------------------------------------
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
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create index if not exists idx_testimonials_sort on public.testimonials (sort_order);

alter table public.testimonials enable row level security;

drop policy if exists "public read active testimonials" on public.testimonials;
create policy "public read active testimonials" on public.testimonials
  for select using (active = true);

drop policy if exists "auth manage testimonials" on public.testimonials;
create policy "auth manage testimonials" on public.testimonials
  for all to authenticated using (true) with check (true);

-- Neighborhoods ----------------------------------------------------------------
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
  before update on public.neighborhoods
  for each row execute function public.set_updated_at();

create index if not exists idx_neighborhoods_sort on public.neighborhoods (sort_order);

alter table public.neighborhoods enable row level security;

drop policy if exists "public read active neighborhoods" on public.neighborhoods;
create policy "public read active neighborhoods" on public.neighborhoods
  for select using (active = true);

drop policy if exists "auth manage neighborhoods" on public.neighborhoods;
create policy "auth manage neighborhoods" on public.neighborhoods
  for all to authenticated using (true) with check (true);

-- Seed testimonials + neighborhoods (only if empty) ----------------------------
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

-- =============================================================================
-- Blog (Market Insights), map coordinates, and saved searches
-- =============================================================================
-- Geo coordinates for the listings map (nullable; map plots only those set).
alter table public.properties add column if not exists lat double precision;
alter table public.properties add column if not exists lng double precision;

-- Blog / Market Insights posts ------------------------------------------------
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null default '',
  body            text not null default '',
  cover_image_url text not null default '',
  author          text not null default '',
  published       boolean not null default true,
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create index if not exists idx_posts_published_at on public.posts (published_at desc);

alter table public.posts enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (published = true);

drop policy if exists "auth manage posts" on public.posts;
create policy "auth manage posts" on public.posts
  for all to authenticated using (true) with check (true);

-- Saved searches (buyer email + criteria; powers new-listing alerts) -----------
create table if not exists public.saved_searches (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  query           text not null default '',
  property_type   text not null default 'any',
  min_price       numeric(12,2),
  max_price       numeric(12,2),
  last_alerted_at timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_saved_searches_email on public.saved_searches (email);

alter table public.saved_searches enable row level security;

drop policy if exists "public insert saved_searches" on public.saved_searches;
create policy "public insert saved_searches" on public.saved_searches
  for insert with check (true);

drop policy if exists "auth manage saved_searches" on public.saved_searches;
create policy "auth manage saved_searches" on public.saved_searches
  for all to authenticated using (true) with check (true);

-- Seed a few starter posts (only if empty) ------------------------------------
insert into public.posts (title, slug, excerpt, body, cover_image_url, author)
select * from (values
  ('Los Angeles Market Update: What Buyers Should Know This Season',
   'la-market-update-buyers',
   'Inventory, pricing trends, and where the opportunities are across LA County right now.',
   'The Los Angeles market continues to reward prepared buyers. Inventory remains tight in the most desirable pockets, but well-priced homes still move quickly. Get pre-approved early, know your must-haves, and work with an agent who knows each neighborhood block by block.',
   'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
   'Your Agent'),
  ('How to Price Your Home to Sell in a Competitive Market',
   'price-your-home-to-sell',
   'Pricing strategy is the difference between a quick, over-ask sale and a stale listing.',
   'Pricing a home correctly from day one is the most important decision a seller makes. The right approach combines recent comparable sales, current neighborhood demand, and strong presentation. Professional staging and photography consistently return more than they cost.',
   'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
   'Your Agent')
) as t(title, slug, excerpt, body, cover_image_url, author)
where not exists (select 1 from public.posts);

-- =============================================================================
-- Done.
-- =============================================================================
