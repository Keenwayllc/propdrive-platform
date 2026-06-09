# Flippa Listing Notes

Internal notes to help craft the marketplace listing. Edit/trim before publishing.

## Suggested title

> **PropDrive — Launch-Ready Real Estate Lead-Gen SaaS (Next.js + Supabase)**

Alternatives:
- "Realtor Website + Lead CRM Platform — Modern Next.js Stack, Resale-Ready"
- "PropDrive: White-Label Real Estate Lead Platform for Agents"

## Suggested description

> PropDrive is a modern, launch-ready real estate lead-generation platform built
> for real estate agents and small brokerages. It combines a polished public
> website — property listings, neighborhood guides, a home-valuation funnel, and
> a live mortgage calculator — with a full agent dashboard: lead CRM,
> appointment scheduling, a property manager, and white-label website & branding
> editors.
>
> Built on a clean, modern stack (Next.js App Router, TypeScript, Tailwind CSS,
> and Supabase), PropDrive is straightforward to re-brand and deploy. Comes with
> complete documentation, a database schema migration, demo seed data, and a
> step-by-step transfer checklist. Deploys to Vercel in minutes.
>
> Perfect for an agent who wants their own lead-gen site, an agency offering
> websites to realtors, or a developer who wants a head start on a proptech SaaS.

## What's included

- ✅ Full source code (Next.js + TypeScript + Tailwind)
- ✅ Public website (12 pages) + agent dashboard (9 sections)
- ✅ Supabase schema migration (`scripts/supabase-migrations.sql`)
- ✅ Demo seed data — sample agent + 8 Los Angeles listings (royalty-free images)
- ✅ Reusable component library (forms, tables, cards, charts, pickers)
- ✅ Zod-validated forms (lead capture, showings, valuation, auth)
- ✅ Complete documentation (`/docs`): setup, deployment, transfer, services
- ✅ `.env.example` with every integration documented
- ✅ Transfer checklist for a smooth handover

## What's NOT included

- ❌ API keys / third-party accounts — the buyer supplies their own (all
     services have free tiers; see `THIRD_PARTY_SERVICES.md`).
- ❌ Real MLS/IDX feed integration (the platform manages listings directly;
     MLS/IDX can be added by the buyer).
- ❌ Legal copy — Privacy & Terms pages are **templates** and must be reviewed by
     the buyer's counsel.
- ❌ Live customer/lead data.
- ❌ Ongoing support beyond the agreed handover (unless negotiated).

## Build status / roadmap (be transparent with buyers)

- **Phase 1 (delivered):** full scaffold — structure, schema, all pages,
  component library, validated forms, and documentation.
- **Phase 2 (roadmap):** live Supabase queries, authentication + route
  protection, persisted form submissions, AI content tools, and email/SMS
  notifications.

> List honestly. If selling at the Phase 1 stage, make clear that backend wiring
> (auth, persistence) is the next step. If Phase 2 is complete before listing,
> update this section accordingly.

## Tech stack (for the listing's specs section)

Next.js · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres/Auth/
Storage) · react-hook-form · Zod · recharts · lucide-react. Deploys on Vercel.
