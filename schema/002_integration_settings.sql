-- 002 — integration_settings: dashboard-managed API keys (OpenAI etc.)
-- Apply: supabase db execute --file schema/002_integration_settings.sql

create table if not exists public.integration_settings (
  id smallint primary key default 1,
  openai_api_key text,
  updated_at timestamptz not null default now(),
  constraint integration_settings_single_row check (id = 1)
);

alter table public.integration_settings enable row level security;

-- Admin check (SECURITY DEFINER avoids RLS recursion on profiles).
create or replace function public.is_admin()
returns boolean language sql security definer
set search_path = public stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

revoke all on function public.is_admin() from anon;

drop policy if exists "admin read integration settings"   on public.integration_settings;
create policy "admin read integration settings"   on public.integration_settings for select to authenticated using (public.is_admin());
drop policy if exists "admin insert integration settings" on public.integration_settings;
create policy "admin insert integration settings" on public.integration_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "admin update integration settings" on public.integration_settings;
create policy "admin update integration settings" on public.integration_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
