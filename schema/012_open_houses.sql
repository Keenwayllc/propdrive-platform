-- 012 — Open house scheduling, per listing. Apply: supabase db execute --file schema/012_open_houses.sql
-- Safe to re-run: every column guarded with IF NOT EXISTS.
--
-- An open house belongs to a property. A listing is "having an open house" when
-- open_house_date is set to today or a future date. Times are stored as plain
-- "HH:MM" text from the dashboard time pickers. All nullable; existing rows are
-- unaffected and simply have no open house scheduled.

alter table public.properties
  add column if not exists open_house_date  date,
  add column if not exists open_house_start text,
  add column if not exists open_house_end   text;
