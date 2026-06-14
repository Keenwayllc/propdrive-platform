# PropDrive

**The real estate lead platform built for agents.**

PropDrive is a launch-ready real estate website + lead-generation platform:
a polished public site (listings, neighborhoods, home valuation, mortgage
calculator) paired with an agent dashboard (lead CRM, appointments, property
manager, website & branding editors, AI tools). Built to be cloned, re-branded,
and resold.

- **Live:** [getpropdrive.com](https://getpropdrive.com)
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
  Supabase (Postgres, Auth, Storage) · OpenAI · Resend · react-hook-form + Zod ·
  recharts · framer-motion · lucide-react

## What's included

**Public site:** homepage, property listings with live search/filter, property
detail pages with photo galleries, LA County neighborhood pages with market
stats, home-valuation request, mortgage calculator, about, contact, privacy &
terms.

**Agent dashboard:** overview stats, lead CRM with status tracking, appointments
manager, full property CRUD with image uploads, CSV lead export, AI tools
(property descriptions, follow-up email drafting), and self-serve white-label
editors (website copy, branding/colors/logo, account & security).

**Built in:** auth with password reset, email notifications on new leads, RLS on
every table, and a fully white-label theming system.

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

**Complete and deployed.** The full platform is live on Vercel at
getpropdrive.com, backed by a production Supabase project (schema, RLS, storage,
and seed data applied). Public site, agent dashboard, auth, AI tools, and email
notifications are all functional. It is pre-revenue and ready for a new owner to
take to market or rebrand.

## Demo account

A working demo agent account is available so you can explore the full dashboard.
Credentials are provided privately on request (never committed to the repo) — see
the [transfer checklist](./docs/TRANSFER_CHECKLIST.md). New owners set their own
login under **Dashboard → Settings** after transfer.
