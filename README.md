# PropDrive

**The real estate lead platform built for agents.**

PropDrive is a launch-ready real estate website + lead-generation platform:
a polished public site (listings, neighborhoods, home valuation, mortgage
calculator) paired with an agent dashboard (lead CRM, appointments, property
manager, website & branding editors, AI tools). Built to be cloned, re-branded,
and resold.

- **Domain (target):** getpropdrive.com
- **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase ·
  react-hook-form + Zod · recharts · lucide-react

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

## Documentation

Full docs live in [`/docs`](./docs):

- [Project overview](./docs/README.md)
- [Setup guide](./docs/SETUP.md) — Supabase project, migrations, seed data, demo user
- [Deployment](./docs/DEPLOYMENT.md) — Vercel, domain, DNS, env vars
- [Transfer checklist](./docs/TRANSFER_CHECKLIST.md) — handing over to a buyer
- [Third-party services](./docs/THIRD_PARTY_SERVICES.md) — required keys & accounts
- [Flippa listing notes](./docs/FLIPPA_LISTING_NOTES.md)

## Project status

**Phase 1 — scaffold (current):** project structure, database schema, all pages,
component library, validated forms, and documentation. Feature/auth/database
logic arrives in Phase 2.

## Demo account

- Email: `demo@getpropdrive.com`
- Password: _choose your own when you create the user_

(Must be created in Supabase Auth — see [SETUP.md](./docs/SETUP.md). Never commit a real password.)
