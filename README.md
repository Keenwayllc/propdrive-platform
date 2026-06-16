# PropDrive

**The real estate lead platform built for agents.**

PropDrive is a launch-ready real estate website + lead-generation platform:
a polished public site (listings, neighborhoods, home valuation, mortgage
calculator) paired with an agent dashboard (lead CRM, appointments, property
manager, website & branding editors, AI tools). Built to be cloned, re-branded,
and resold.

- **Live:** [getpropdrive.com](https://getpropdrive.com)
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
  Supabase (Postgres, Auth, Storage) · OpenAI · Resend · Leaflet/OpenStreetMap ·
  react-hook-form + Zod · recharts · qrcode · framer-motion · lucide-react

## What's included

**Public site:** homepage, property listings with live search/filter and address
autocomplete, property detail pages with photo galleries and an interactive map,
LA County neighborhood pages with market stats, a Market Insights blog,
home-valuation request, mortgage calculator, about, contact, privacy & terms.
Per-listing SEO (schema.org rich-result data) and social share images, plus a
printable property flyer with a scan-to-view QR code.

**Agent dashboard:** overview with lead analytics (leads over time, by type, and
a status pipeline), lead CRM with status tracking, appointments manager, full
property CRUD with image uploads and automatic map pins, CSV lead export, and a
full AI tool suite (8 tools: listing descriptions, social posts, follow-up
emails, neighborhood highlights, an advisor, an objection handler, an open-house
planner, and price positioning), plus an AI article writer in the blog.

**White-label, owner-editable:** company name, logo, colors, agent details,
homepage stats, hero image, testimonials, neighborhoods, blog, and all marketing
copy, edited from the dashboard with AI assist and one-click clear/reset.

**Growth & built-ins:** buyer/seller/valuation/general lead forms, schedule a
showing, saved-search email alerts (cron), auth with password reset, email
notifications on new leads, address autocomplete and geocoding with no paid API
key (OpenStreetMap), and RLS on every table.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev                  # http://localhost:3000

# Optional: load (or reset) the demo properties + neighborhoods
CONFIRM_RESET=yes npm run seed
```

> `npm run seed` reads `scripts/seed-data.json` and reseeds the `properties` and
> `neighborhoods` tables using your service-role key. The `CONFIRM_RESET=yes`
> guard is required because it clears those tables first, so it can never wipe a
> live database by accident.

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
