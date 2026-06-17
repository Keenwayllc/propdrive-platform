# PropDrive

**Realtor Website With Admin Dashboard.**

PropDrive is a launch-ready realtor website with a built-in admin dashboard:
a polished public site (listings, home valuation, mortgage calculator) paired
with a clean dashboard to manage listings, leads, appointments, branding,
testimonials, and website content. Built to be rebranded and launched for any
agent in a day.

- **Live:** [getpropdrive.com](https://getpropdrive.com)
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
  Supabase (Postgres, Auth, Storage) · Leaflet/OpenStreetMap · react-hook-form +
  Zod · framer-motion · lucide-react

## What's included

**Public site:** homepage, property listings with search, filter, and an
interactive map, property detail pages with photo galleries, home-valuation
request, mortgage calculator, about, contact (with lead capture and a
schedule-a-showing form), privacy and terms.

**Admin dashboard:**
- Overview: total leads, active listings, upcoming appointments, recent leads, quick actions
- Leads: name, email, phone, type, message, property interest, status
- Appointments: name, email, phone, property, date, time, notes, status
- Properties: add / edit / delete with photo uploads (price, address, beds, baths, sqft, description, status)
- Website Editor: company name, hero title and subtitle, phone, email, about, footer, social links
- Branding: logo, primary color, accent color, agent name, agent photo, brokerage name
- Testimonials: manage the client quotes shown on the homepage
- Settings: account and security

**White-label, owner-editable:** company name, logo, colors, agent details,
testimonials, and all marketing copy, edited from the dashboard. The public site
accent and headings follow the brand colors.

**Built-ins:** lead capture forms, schedule-a-showing, auth with password reset,
optional email notifications on new leads, address autocomplete and map pins with
no paid API key (OpenStreetMap), and RLS on every table.

> Note: this is the simplified "realtor website" build. Some advanced modules
> (saved searches, market insights blog, neighborhoods, AI tools, integrations,
> and the custom-domain guide) remain in the codebase but are hidden from the UI
> for a cleaner product. Re-enable them by restoring the sidebar links in
> `app/dashboard/layout.tsx` and the corresponding dashboard pages.

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
