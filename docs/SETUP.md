# Setup Guide

This guide takes you from a fresh clone to a running local instance with a
seeded database.

## Prerequisites

- **Node.js 20+** (Node 24 recommended)
- **npm** (ships with Node)
- A free **Supabase** account — https://supabase.com

---

## 1. Install dependencies

```bash
npm install
```

Installed packages of note: `next`, `react`, `tailwindcss`, `react-hook-form`,
`@hookform/resolvers`, `zod`, `lucide-react`, `recharts`,
`@supabase/supabase-js`.

---

## 2. Create a Supabase project

1. Go to https://supabase.com/dashboard and click **New project**.
2. Choose an organization, name it (e.g. `propdrive`), set a database password,
   and pick a region close to your users.
3. Wait for provisioning (~2 minutes).

---

## 3. Run the database migration

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`scripts/supabase-migrations.sql`](../scripts/supabase-migrations.sql).
3. Click **Run**.

This creates all tables (`profiles`, `site_settings`, `brand_settings`,
`properties`, `leads`, `appointments`), indexes, `updated_at` triggers, starter
Row-Level-Security policies, and seeds one row each into the settings tables.

> The migration is safe to re-run — it uses `IF NOT EXISTS` / `DROP ... IF EXISTS`
> guards throughout.

---

## 4. Seed demo data (optional)

[`scripts/seed-data.json`](../scripts/seed-data.json) contains a sample agent,
neighborhoods, and 8 San Diego properties. In Phase 1 there is no automated
import script; load it however you prefer:

- **Manual:** copy property rows into the Supabase Table Editor, or
- **SQL:** convert the JSON into `insert` statements, or
- **Phase 2:** a seeding script (`scripts/seed.ts`) will read this file directly.

All image URLs are royalty-free (Unsplash).

---

## 5. Environment variables

```bash
cp .env.example .env.local
```

Fill in at minimum the Supabase values:

| Variable                          | Where to find it                                  |
| --------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase → Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase → Project Settings → API Keys → anon/public |
| `SUPABASE_SERVICE_KEY`            | Supabase → Project Settings → API Keys → service_role (keep secret!) |

The remaining keys (Google Maps, Resend, Twilio, OpenAI, Stripe) are optional in
Phase 1 — see [THIRD_PARTY_SERVICES.md](./THIRD_PARTY_SERVICES.md).

> **Never commit `.env.local`.** It is gitignored. Only `.env.example` (with
> placeholders) is tracked.

---

## 6. Create the demo user

1. Supabase dashboard → **Authentication → Users → Add user**.
2. Email: `demo@getpropdrive.com`, and a strong password **you choose** (never commit it), then confirm the email.
3. Copy the new user's UUID.
4. In the **SQL Editor**, insert a matching profile:

```sql
insert into public.profiles (id, email, full_name, role)
values ('<paste-user-uuid>', 'demo@getpropdrive.com', 'Sophia Carter', 'admin');
```

> Authentication is fully wired in **Phase 2**. In Phase 1 the login form
> validates input but does not yet establish a session.

---

## 7. Run locally

```bash
npm run dev
```

Open http://localhost:3000. The dashboard is at http://localhost:3000/dashboard
(unprotected in Phase 1).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```
