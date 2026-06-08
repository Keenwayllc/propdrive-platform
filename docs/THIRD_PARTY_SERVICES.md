# Third-Party Services

PropDrive integrates with several external services. **Supabase is required**;
everything else is optional and only needed if you use that feature.

> **Buyer responsibility:** The buyer must create their own accounts and supply
> their own API keys. No seller keys are included in this codebase. All keys are
> configured via environment variables (`.env.local` locally, Vercel env vars in
> production) — never hard-coded.

| Service | Required? | Purpose | Free tier? |
| --- | --- | --- | --- |
| **Supabase** | ✅ Required | Postgres database, auth, file storage | Yes |
| **Vercel** | ✅ Required (hosting) | Deployment + custom domain | Yes (Hobby) |
| **Google Maps** | Optional | Property maps & address autocomplete | Yes (with billing on) |
| **Resend** | Optional | Transactional email (lead notifications) | Yes |
| **Twilio** | Optional | SMS notifications | Trial credit |
| **OpenAI** | Optional | AI content tools (Phase 2) | Pay-as-you-go |
| **Stripe** | Optional | Payments/subscriptions if monetizing | Yes (pay per txn) |

---

## Where to get each key

### Supabase (required)
- Sign up: https://supabase.com
- Keys: Project Settings → API.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY` (service_role — **keep secret**)

### Google Maps
- Console: https://console.cloud.google.com
- Enable **Maps JavaScript API** + **Places API**, create an API key, and
  restrict it to your domain.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Resend (email)
- https://resend.com → API Keys.
- Verify your sending domain for production.
- `RESEND_API_KEY`

### Twilio (SMS)
- https://www.twilio.com → Console.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- Note: US SMS requires A2P/10DLC registration.

### OpenAI (AI tools)
- https://platform.openai.com → API keys.
- `OPENAI_API_KEY`

### Stripe (payments — optional)
- https://dashboard.stripe.com → Developers → API keys.
- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`

---

## Env var summary

All variables live in `.env.example`. Copy it to `.env.local` for local dev and
add the same keys in Vercel for production. `NEXT_PUBLIC_*` variables are exposed
to the browser; all others are server-only and must be kept secret.
