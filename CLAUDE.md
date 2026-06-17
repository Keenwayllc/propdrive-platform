# PropDrive

@AGENTS.md

Realtor lead-gen SaaS for Flippa resale. White-label site + agent dashboard, LA County market (Beverly Hills, Bel Air, Santa Monica, Malibu, Westwood, Pacific Palisades, Calabasas, Brentwood, Encino). **No San Diego content.**

Live domain: getpropdrive.com

## Stack

- Next.js 16 + TypeScript (see AGENTS.md — breaking changes from prior versions)
- Supabase (hosted; Postgres + Auth + Storage)
- Tailwind CSS + shadcn/ui
- Vercel deployment

## Database — critical rules

**Never run `prisma migrate deploy` or `supabase db push` on prod.** DB not tracked by Prisma migrations. Blind ORM diffs drop/rewrite live columns.

**All schema changes = additive SQL files:**

```
schema/
  001_initial_schema.sql
  002_integration_settings.sql
  003_content_tables.sql
  004_blog_map_saved_searches.sql
```

Apply change:
1. New file: `schema/005_<description>.sql`
2. Use `IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS` guards → idempotent
3. Apply: `supabase db execute --file schema/005_<description>.sql`
4. Commit file — file IS migration history

**Every new table: enable RLS immediately** + define explicit policies before migration done. No exceptions.

## Key files

| File | Purpose |
|---|---|
| `lib/supabase-server.ts` | Server-side Supabase client (SSR) |
| `lib/supabase-client.ts` | Browser Supabase client |
| `lib/supabase-admin.ts` | Service-role client (server only, never expose) |
| `lib/queries.ts` | All DB read queries |
| `lib/actions.ts` | Server actions (mutations) |
| `lib/auth.ts` | Auth helpers |
| `lib/types.ts` | Shared TypeScript types |
| `scripts/seed-data.json` | Demo seed content |

## Design

Crisp high-contrast real estate look: cool-white canvas, deep slate ink, vivid blue accent (`#006aff`), Zillow-inspired but with PropDrive editorial serif headlines (Fraunces). Tokens in `app/globals.css`; public site accent/ink from `brand_settings` (white-label). Use `impeccable` skill for all UI work.

## Auth & roles

Three roles in `profiles.role`: `agent`, `admin`, `staff`. Dashboard access needs `authenticated`. Integration settings (API keys) need `admin` via `is_admin()` function.

## What this is built to resell

Flippa buyer gets white-label real estate site + admin dashboard, deployable in a day. First thing they do: update `brand_settings` and `site_settings`. Keep those two tables as source of truth for all visual identity + copy — never hardcode agent name, brand colors, or company name in components.