# PropDrive — Your First 15 Minutes

Welcome — you now own a complete realtor website **and** an admin dashboard. Everything visitors see is editable from the dashboard; you don't touch code to rebrand it. Follow these steps in order and you'll have a fully personalized, live site.

> **The golden rule:** the public site reads everything from two places — **Branding** and **Pages**. Set those and the whole site (titles, footer, About, contact, search-engine listing) updates automatically.

---

## 0. Sign in
1. Go to `https://your-domain.com/auth/login`
2. Sign in with the agent account credentials provided at handover.
3. You land on the **Dashboard**. The left sidebar is your control panel.

> Change your login email/password under **Settings** once you're in.

---

## 1. Branding — your identity (do this first)
**Dashboard → Branding**

| Field | What it controls |
|---|---|
| Logo | Header + footer logo across the whole site |
| Light logo (optional) | A version that sits on the dark footer |
| Colors (accent / ink) | Your brand color everywhere — buttons, links, accents |
| Agent name | Your name in the homepage, About page, and lead CTAs |
| Brokerage name | Company name shown alongside your bio |
| License / DRE number | Footer compliance line (hidden entirely if you leave it blank) |
| Agent photo | The large portrait on the homepage + About page |
| Hero image | Background imagery + the social-share preview image |

Save. Your name, logo, and colors now flow through every page.

---

## 2. Pages — your words
**Dashboard → Pages.** One dropdown edits every page:

1. **Home page** — business name, hero headline + subtitle, the "Recent results" cards, and your 3 stat numbers.
2. **About page** — your bio and the bottom call-to-action card.
3. **Contact & footer** — **important:** set your **phone, email, and office address** here. Until you do, those rows simply don't appear (no placeholder data). Also set your footer tagline and social links.
4. **Properties / Open Houses / Home Value / Mortgage — heading** — optional. Tweak the heading + intro text on each of those pages.

> ✍️ Each page has a "Write with AI" button on the text fields if you connect OpenAI in step 6.

---

## 3. Properties — your listings
**Dashboard → Properties → Add listing**

- Fill in address (autocompletes + drops a map pin), price, beds/baths/sqft, photos, and a description (or click **Write with AI**).
- **Open house?** Scroll to the "Open house (optional)" block and set a date + start/end time. The listing automatically appears on your public **Open Houses** page, grouped by date, and drops off once the date passes.
- Toggle **Active** to show/hide a listing; **Featured** to highlight it.

Add a few real listings and delete the demo ones when you're ready.

---

## 4. Testimonials & Banners
- **Dashboard → Testimonials** — add real client quotes. (Until you do, tasteful sample quotes show as placeholders.)
- **Dashboard → Banners** — optional rotating hero slides on the homepage.

---

## 5. Settings
**Dashboard → Settings** — update your account email and password.

---

## 6. AI Assistant (optional but recommended)
**Dashboard → AI Assistant** — paste an OpenAI API key to unlock the "Write with AI" buttons (listing descriptions, hero copy, bios, CTA text). The site works fully without it; this just speeds up writing.

---

## 7. Go live on your domain
The site deploys on Vercel. To point your own domain:
1. In Vercel → your project → **Settings → Domains**, add your domain.
2. Follow Vercel's DNS instructions at your registrar.
3. Done — HTTPS is automatic.

---

## Good to know

- **White-label by design.** Before you fill things in, the site shows neutral, generic copy — never another agent's name or a fake phone number. The moment you set Branding + Pages, your details take over.
- **The demo content is yours to keep or wipe.** The starter listings/testimonials are there so the site looks alive on day one. Replace them at your pace.
- **Leads land in the dashboard.** Every contact form, valuation request, mortgage inquiry, and showing request saves to **Dashboard → Leads** (or **Appointments**). Export leads to CSV anytime.
- **Nothing is hardcoded.** If you ever see copy you can't find a field for, check **Pages** first — it's almost certainly there.

Questions? The codebase is documented and the schema lives in `/schema` as plain, additive SQL files.
