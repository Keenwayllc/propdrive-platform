# PropDrive

@AGENTS.md

Realtor lead-gen SaaS built for Flippa resale. White-label site + agent dashboard for the LA County market (Beverly Hills, Bel Air, Santa Monica, Malibu, Westwood, Pacific Palisades, Calabasas, Brentwood, Encino). **No San Diego content.**

Live domain: getpropdrive.com

## Stack

- Next.js 16 + TypeScript (see AGENTS.md — breaking changes from prior versions)
- Supabase (hosted; Postgres + Auth + Storage)
- Tailwind CSS + shadcn/ui
- Vercel deployment

## Database — critical rules

**Never run `prisma migrate deploy` or `supabase db push` against prod.** The DB is not tracked by Prisma migrations. Blind ORM diffs will drop or rewrite live columns.

**All schema changes must be additive SQL files:**

```
schema/
  001_initial_schema.sql
  002_integration_settings.sql
  003_content_tables.sql
  004_blog_map_saved_searches.sql
```

To apply a change:
1. Write a new file: `schema/005_<description>.sql`
2. Use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` guards so it's idempotent
3. Apply: `supabase db execute --file schema/005_<description>.sql`
4. Commit the file — this IS the migration history

**Every new table must immediately enable RLS** and define explicit policies before the migration is complete. No exceptions.

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

"Coastal Luxe" — premium LA real estate aesthetic. Clean, high-contrast, aspirational. Use the `impeccable` skill for all UI work. Avoid generic card grids and flat blue buttons.

## Auth & roles

Three roles in `profiles.role`: `agent`, `admin`, `staff`. Dashboard access requires `authenticated`. Integration settings (API keys) require `admin` via the `is_admin()` function.

## What this is built to resell

A buyer on Flippa gets a white-label real estate site + admin dashboard they can deploy in a day. The first thing they'll do is update `brand_settings` and `site_settings`. Keep those two tables as the source of truth for all visual identity and copy — never hardcode the agent name, brand colors, or company name anywhere in components.
