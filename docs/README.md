# PropDrive

**The real estate lead platform built for agents.**

PropDrive is a launch-ready real estate website + lead-generation platform. It
pairs a polished public-facing site (listings, neighborhoods, home valuation,
mortgage calculator) with an agent dashboard (lead CRM, appointments, property
manager, website & branding editors, and AI tools). It's designed to be cloned,
re-branded, and resold.

- **Live domain (target):** getpropdrive.com
- **Repo:** https://github.com/Keenwayllc/propdrive-platform

---

## Features

### Public website
- Home page with hero, value props, and lead capture
- Property listings with filtering + detail pages
- Neighborhood guides
- Open houses
- Home valuation (seller lead capture)
- Mortgage calculator (live client-side estimate)
- About & Contact pages
- Privacy & Terms (template legal pages)

### Agent dashboard
- Overview with summary stats + analytics chart
- Leads CRM
- Appointments management
- Property manager (add / edit listings)
- Website editor (edit public copy)
- Branding editor (colors, logo, agent photo)
- AI tools hub (OpenAI-powered content — Phase 2)
- Integrations overview
- Account settings

---

## Tech stack

| Layer        | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | Next.js (App Router) + React 19          |
| Language     | TypeScript (strict)                      |
| Styling      | Tailwind CSS v4                          |
| Forms        | react-hook-form + Zod                    |
| Icons        | lucide-react                             |
| Charts       | recharts                                 |
| Backend      | Supabase (Postgres, Auth, Storage)       |
| Email        | Resend (optional)                        |
| SMS          | Twilio (optional)                        |
| AI           | OpenAI (optional)                        |
| Payments     | Stripe (optional)                        |
| Maps         | Google Maps (optional)                   |

> **Note:** The project was scaffolded with the latest `create-next-app`, which
> installs **Next.js 16**. It runs on the App Router and is fully compatible with
> the spec's Next 15 requirements (dynamic-route `params` are async).

---

## Folder structure

```
propdrive-platform/
├── app/
│   ├── (marketing)/        # Public pages (shared nav + footer)
│   │   ├── page.tsx        # Home  →  /
│   │   ├── properties/     # Listings + [id] details
│   │   ├── neighborhoods/  # Index + [name] details
│   │   ├── home-valuation/
│   │   ├── mortgage-calculator/
│   │   ├── open-houses/
│   │   ├── about/  contact/  privacy/  terms/
│   │   └── layout.tsx
│   ├── dashboard/          # Protected agent dashboard (sidebar layout)
│   ├── auth/               # login + forgot-password
│   └── layout.tsx          # Root layout (fonts, metadata)
├── components/             # Reusable UI (nav, forms, tables, cards, ...)
├── lib/                    # types, supabase-client, auth, form-schemas
├── public/                 # Static assets
├── docs/                   # This documentation
└── scripts/                # supabase-migrations.sql, seed-data.json
```

> The `(marketing)` folder is a Next.js *route group* — it shares a layout
> without changing URLs (the home page is still `/`).

---

## Local setup (quick start)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in your keys

# 3. Run the dev server
npm run dev                  # http://localhost:3000
```

See [SETUP.md](./SETUP.md) for full details (Supabase project, migrations, seed
data, and the demo user).

---

## Demo account

For documentation/demo purposes:

- **Email:** demo@getpropdrive.com
- **Password:** set your own when creating the user (never commit a real password)

This user must be created in Supabase Auth — see [SETUP.md](./SETUP.md).

---

## Deployment

PropDrive is optimized for Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the
full walkthrough (env vars, domain, DNS, and a go-live checklist).

---

## Project phases

- **Phase 1 (this scaffold):** project structure, schema, pages, components,
  docs. No feature/auth/database logic yet.
- **Phase 2:** wire Supabase queries, authentication, route protection, form
  submissions, AI tools, email/SMS notifications.

---

## License & reselling

This codebase is prepared for resale on Flippa. See
[FLIPPA_LISTING_NOTES.md](./FLIPPA_LISTING_NOTES.md) and
[TRANSFER_CHECKLIST.md](./TRANSFER_CHECKLIST.md).
