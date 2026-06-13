# Buyer Transfer Checklist

A step-by-step checklist for transferring PropDrive to a new owner after a
Flippa (or private) sale. Work top to bottom.

## 1. Domain
- [ ] Initiate domain transfer of `getpropdrive.com` (or push within the same
      registrar) to the buyer's account.
- [ ] Buyer confirms receipt and unlocks/relocks as needed.
- [ ] Update DNS once Vercel is set up under the buyer's account (see DEPLOYMENT.md).

## 2. GitHub repository
- [ ] Transfer the `propdrive-platform` repo to the buyer's GitHub org/account
      (Settings → Danger Zone → Transfer ownership), **or** have the buyer fork
      and re-point.
- [ ] Remove the seller's collaborator access after handover.

## 3. Supabase
Two options — pick one:
- **Easiest (non-technical buyer):** transfer the existing Supabase project to
  the buyer's organization (Project → Settings → General → Transfer project).
  Data comes with it; then wipe demo content and reset the admin login.
- **Clean slate:** buyer creates their **own** Supabase project, runs
  `scripts/supabase-migrations.sql`, optionally imports `scripts/seed-data.json`,
  and creates an admin user in Supabase Auth + a matching `profiles` row.
- [ ] Either way: confirm **no seller data or credentials remain**.

## 4. Vercel
- [ ] Buyer imports the repo into their own Vercel account.
- [ ] Add all environment variables (buyer's own keys).
- [ ] Connect the domain + DNS.
- [ ] Trigger a production deploy and confirm it's green.

## 5. API keys (buyer provides their own — see THIRD_PARTY_SERVICES.md)
- [ ] Supabase URL + anon + service keys
- [ ] Google Maps API key (optional)
- [ ] Resend API key (optional)
- [ ] Twilio SID / token / phone number (optional)
- [ ] OpenAI API key (optional)
- [ ] Stripe public/secret keys (optional)
- [ ] Confirm **no seller keys remain** anywhere in env or code.

## 6. Branding update
- [ ] Replace agent name, photo, brokerage, and DRE license number.
- [ ] Update logo + favicon.
- [ ] Set brand colors in the dashboard Branding editor.
- [ ] Update site copy (hero, about, footer) via the Website Editor.
- [ ] Replace demo listings with real inventory.
- [ ] Update contact details (phone, email, office address).

## 7. Legal review (important)
- [ ] Replace the **Privacy Policy** template (`/privacy`) with counsel-reviewed text.
- [ ] Replace the **Terms of Service** template (`/terms`) with counsel-reviewed text.
- [ ] Confirm fair-housing / Equal Housing Opportunity compliance and correct
      license disclosures in the footer.
- [ ] If using SMS, ensure Twilio opt-in/consent language and carrier
      registration (A2P/10DLC) are complete.

## 8. Final testing
- [ ] Run the go-live checklist in DEPLOYMENT.md end-to-end.
- [ ] Submit a test lead and confirm it lands in the dashboard (Phase 2).
- [ ] Verify all pages on mobile + desktop.
- [ ] Confirm HTTPS, no console errors, and acceptable Lighthouse scores.

## 9. Handover
- [ ] Share this `docs/` folder with the buyer.
- [ ] Hand over (or have buyer rotate) all credentials.
- [ ] Seller removes access to all services.
