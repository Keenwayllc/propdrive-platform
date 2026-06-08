# Deployment Guide (Vercel)

PropDrive is a standard Next.js app and deploys cleanly to Vercel.

## 1. Push to GitHub

Ensure your code is on GitHub (this repo:
`https://github.com/Keenwayllc/propdrive-platform`).

## 2. Import into Vercel

1. Go to https://vercel.com/new.
2. Import the `propdrive-platform` repository.
3. Vercel auto-detects Next.js — keep the defaults:
   - **Framework preset:** Next.js
   - **Build command:** `next build`
   - **Output:** (managed by Vercel)
4. **Do not deploy yet** — add environment variables first (next step).

## 3. Environment variables in Vercel

Project → **Settings → Environment Variables**. Add each key from
`.env.example` for the **Production** (and optionally Preview) environments:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public |
| `SUPABASE_SERVICE_KEY` | ✅ | **Secret** — server only |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | optional | Public |
| `RESEND_API_KEY` | optional | Secret |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` | optional | Secret |
| `OPENAI_API_KEY` | optional | Secret |
| `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` | optional | Secret |

After adding variables, click **Deploy**.

## 4. Connect the domain

1. Project → **Settings → Domains → Add**.
2. Enter `getpropdrive.com` (and `www.getpropdrive.com`).

### DNS setup

At your domain registrar, point DNS at Vercel:

| Type  | Name  | Value                  |
| ----- | ----- | ---------------------- |
| A     | `@`   | `76.76.21.21`          |
| CNAME | `www` | `cname.vercel-dns.com` |

> Vercel shows the exact records to add on the Domains screen — always follow
> the values it displays, as they can change. DNS propagation can take up to 48h
> (usually much faster).

## 5. Supabase production config

- In Supabase → **Authentication → URL Configuration**, set the **Site URL** to
  `https://getpropdrive.com` and add it to **Redirect URLs**.
- Confirm the migration has been run on the production Supabase project.

## 6. Go-live testing checklist

- [ ] Home page loads with hero + listings section
- [ ] `/properties` renders (and lists data once seeded)
- [ ] Property detail pages load (`/properties/<id>`)
- [ ] Neighborhood pages load
- [ ] Mortgage calculator computes a payment
- [ ] Home valuation + contact + lead forms validate and submit
- [ ] `/dashboard` and all sub-pages render
- [ ] `/auth/login` and `/auth/forgot-password` render and validate
- [ ] Images load (Unsplash hosts are allowed in `next.config.ts`)
- [ ] No console errors in production build
- [ ] Custom domain serves over HTTPS

## Troubleshooting

- **Images 400/blocked:** add the image host to `images.remotePatterns` in
  `next.config.ts`.
- **Supabase errors:** verify env vars exist in the correct Vercel environment
  and the migration ran.
- **Build fails on types:** run `npm run build` locally to reproduce.
