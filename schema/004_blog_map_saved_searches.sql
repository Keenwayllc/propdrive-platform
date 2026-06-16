-- 004 — blog posts, map coordinates, saved searches
-- Apply: supabase db execute --file schema/004_blog_map_saved_searches.sql

-- Geo coordinates (nullable; map only plots listings where both are set)
alter table public.properties add column if not exists lat double precision;
alter table public.properties add column if not exists lng double precision;

-- posts -----------------------------------------------------------------------
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
  before update on public.posts for each row execute function public.set_updated_at();
create index if not exists idx_posts_published_at on public.posts (published_at desc);
alter table public.posts enable row level security;
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (published = true);
drop policy if exists "auth manage posts" on public.posts;
create policy "auth manage posts" on public.posts for all to authenticated using (true) with check (true);

-- saved_searches --------------------------------------------------------------
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
create policy "public insert saved_searches" on public.saved_searches for insert with check (true);
drop policy if exists "auth manage saved_searches" on public.saved_searches;
create policy "auth manage saved_searches" on public.saved_searches for all to authenticated using (true) with check (true);

-- Seeds -----------------------------------------------------------------------
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
