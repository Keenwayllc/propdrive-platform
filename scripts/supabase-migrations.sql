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
-- Vercel env vars. Single row. RLS restricts to authenticated; no anon access,
-- so the secret never reaches the public API. Server code reads it; the client
-- only ever sees a masked preview.
-- =============================================================================
create table if not exists public.integration_settings (
  id smallint primary key default 1,
  openai_api_key text,
  updated_at timestamptz not null default now(),
  constraint integration_settings_single_row check (id = 1)
);

alter table public.integration_settings enable row level security;

drop policy if exists "authed read integration settings" on public.integration_settings;
create policy "authed read integration settings" on public.integration_settings
  for select to authenticated using (true);

drop policy if exists "authed insert integration settings" on public.integration_settings;
create policy "authed insert integration settings" on public.integration_settings
  for insert to authenticated with check (true);

drop policy if exists "authed update integration settings" on public.integration_settings;
create policy "authed update integration settings" on public.integration_settings
  for update to authenticated using (true);

-- =============================================================================
-- Done.
-- =============================================================================
