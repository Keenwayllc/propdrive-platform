-- 005: add editable hero CTA text + service area to site_settings.
-- Additive and idempotent. Apply: supabase db execute --file schema/005_site_cta_service_area.sql

alter table site_settings add column if not exists cta_text text not null default '';
alter table site_settings add column if not exists service_area text not null default '';
