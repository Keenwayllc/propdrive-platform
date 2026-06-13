# Welcome — Your PropDrive Site, In Plain English

This guide is for the **new owner**. No coding required. It explains, step by
step, how to take ownership of your website and run it day to day. If you ever
feel stuck, the seller can do the technical handover for you (ask about
"white-glove setup").

---

## The big picture (read this first)

Your website is made of **four pieces**, each owned through a free account.
Think of them like the utilities for a house:

| Piece | What it does | Account you'll need |
|-------|--------------|---------------------|
| **Domain** (getpropdrive.com or your own) | Your web address | Namecheap (or any registrar) |
| **Hosting** (Vercel) | Serves the website to visitors | Vercel |
| **Database** (Supabase) | Stores leads, listings, your login | Supabase |
| **Code** (GitHub) | The website's source files | GitHub |

**Good news:** once setup is done, you live entirely inside your **PropDrive
dashboard** — adding listings, editing pages, viewing leads. You will almost
never open Vercel, GitHub, or Supabase again. The hard part is a **one-time
transfer**, not daily work.

---

## Part 1 — Taking ownership (one time)

You don't need to *learn* these platforms. For each one, you mostly **create a
free account and click "Accept"** on a transfer the seller sends you.

### Step 1: Create your accounts
Sign up (free) for each, using the **same email** to keep things simple:
- GitHub → https://github.com/signup
- Vercel → https://vercel.com/signup (choose "Continue with GitHub")
- Supabase → https://supabase.com/dashboard (choose "Continue with GitHub")
- Namecheap (if your domain is there) → https://www.namecheap.com

Tell the seller the email/username you used for each.

### Step 2: Accept the transfers
The seller sends each piece to your account. You'll get emails — open each and
click **Accept**:
- **GitHub:** accept the repository transfer.
- **Vercel:** accept the project transfer (your hosting + settings come with it).
- **Supabase:** accept the project transfer (your database + data come with it).
- **Domain:** if it's on Namecheap, the seller "pushes" it to your account
  (instant). If it's moving to a different registrar, the seller gives you an
  **auth code**; you start a transfer and wait ~5–7 days.

### Step 3: Confirm it's live
Visit your domain. If the site loads, you're done. If the domain isn't pointing
yet, Vercel shows the exact settings to paste at your registrar — or ask the
seller to point it for you.

### Step 4: Change the password
In your **PropDrive dashboard → Settings**, change the login email and password
to your own. Then ask the seller to confirm they've removed their access to all
four accounts.

> That's the entire technical part. Everything below is normal, click-around work.

---

## Part 2 — Making it yours (in the dashboard)

All of this is done inside your PropDrive dashboard — no other platforms.

- **Branding** → your name, photo, brokerage, logo, license number, brand color.
- **Website Editor** → headline, about text, footer, contact phone/email/address.
- **Properties** → remove the demo listings, add your real inventory.
- **Settings** → your login email and password.

Changes appear on your live site automatically. You do **not** need to "deploy"
anything for content edits.

---

## Part 3 — Optional power-ups (connect when you want them)

These add features. Each is optional and pay-as-you-go with the provider.

- **OpenAI** (AI writing tools): the easiest one — go to **Dashboard → AI Tools**
  and paste your key right there. No technical setup. To get the key: sign in at
  **platform.openai.com** (the developer site — *not* chatgpt.com, and separate
  from a ChatGPT Plus subscription), add a payment method + a few dollars of
  credit under **Settings → Billing**, then create a key under **API keys**.
  Copy it immediately — it's shown only once. The "How do I find my key?" help
  on the AI Tools page walks through this too.
- **Resend** (sends email), **Twilio** (sends SMS), **Google Maps** (maps on
  listings), **Stripe** (payments): these are set in **Vercel → Settings →
  Environment Variables**. The **Integrations** page in your dashboard lists the
  exact names to copy and a "Get your key" link for each. After adding a key in
  Vercel, click **Redeploy** there once.

If any of that feels too technical, you can skip it — the core site (listings,
leads, pages) works without them — or ask the seller to set them up.

---

## Quick answers

**Do I need to know how to code?** No. Daily work is all point-and-click in the
dashboard.

**Will the seller help?** Many include free setup. Ask before purchase.

**What if I break something?** Content lives in the database and is editable;
the code can always be redeployed. Nothing you do in the dashboard is permanent
in a scary way.

**Where do leads go?** Into your dashboard under **Leads**, and you can export
them to a spreadsheet anytime (Leads → Export CSV).

---

## Don't-forget checklist

- [ ] Created GitHub, Vercel, Supabase, (Namecheap) accounts
- [ ] Accepted all four transfers
- [ ] Site loads on your domain
- [ ] Changed login email + password (Settings)
- [ ] Seller removed their access
- [ ] Updated branding, contact info, and listings
- [ ] Had a lawyer review the Privacy Policy & Terms (templates are placeholders)
