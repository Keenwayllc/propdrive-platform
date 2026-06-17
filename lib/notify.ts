import "server-only";

/**
 * Email notifications to the realtor when a new lead / appointment comes in.
 * Uses Resend's REST API directly (no SDK dependency). Fully optional: if no
 * RESEND_API_KEY is set it silently does nothing, so the public forms never
 * break. Failures are swallowed — a notification must never fail a submission.
 *
 * Recipient: NOTIFY_TO env override, else site_settings.contact_email.
 * Sender: NOTIFY_FROM env, else Resend's shared test sender (works without a
 * verified domain, but only delivers to the Resend account owner — buyers set
 * NOTIFY_FROM to their own verified domain in production).
 */
import { createServiceClient } from "@/lib/supabase-admin";

function esc(s: string | null | undefined): string {
  return (s ?? "").replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"
  );
}

async function recipient(): Promise<string | null> {
  if (process.env.NOTIFY_TO) return process.env.NOTIFY_TO;
  const admin = createServiceClient();
  if (!admin) return null;
  const { data } = await admin
    .from("site_settings")
    .select("contact_email")
    .limit(1)
    .maybeSingle();
  return (data?.contact_email as string | null) ?? null;
}

/**
 * Branded email header: the owner's uploaded logo when set, otherwise their
 * company name. Keeps every notification on-brand for the agent.
 */
async function brandHeader(): Promise<string> {
  let logo: string | null = null;
  let company = "PropDrive";
  const admin = createServiceClient();
  if (admin) {
    const { data: b } = await admin
      .from("brand_settings")
      .select("logo_url, company_name")
      .limit(1)
      .maybeSingle();
    logo = (b?.logo_url as string | null) ?? null;
    if (b?.company_name) company = b.company_name as string;
    if (company === "PropDrive") {
      const { data: s } = await admin
        .from("site_settings")
        .select("company_name")
        .limit(1)
        .maybeSingle();
      if (s?.company_name) company = s.company_name as string;
    }
  }
  const inner = logo
    ? `<img src="${esc(logo)}" alt="${esc(company)}" style="height:40px;max-width:220px;object-fit:contain" />`
    : `<span style="font-size:20px;font-weight:600;color:#15181f">${esc(company)}</span>`;
  return `<div style="padding:0 0 16px;margin:0 0 16px;border-bottom:1px solid #e8e1d6">${inner}</div>`;
}

async function send(subject: string, rows: Array<[string, string | null]>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // not configured — silent no-op

  try {
    const to = await recipient();
    if (!to) return;
    const from = process.env.NOTIFY_FROM || "PropDrive <onboarding@resend.dev>";

    const body = rows
      .filter(([, v]) => v && v.trim())
      .map(
        ([label, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#75695b">${esc(
            label
          )}</td><td style="padding:4px 0;color:#15181f"><strong>${esc(
            v
          )}</strong></td></tr>`
      )
      .join("");

    const header = await brandHeader();
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:520px">
        ${header}
        <h2 style="color:#15181f;margin:0 0 4px">${esc(subject)}</h2>
        <p style="color:#75695b;margin:0 0 16px">Sign in to your dashboard to follow up.</p>
        <table style="border-collapse:collapse;font-size:14px">${body}</table>
      </div>`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (err) {
    console.error(
      "[notify] send failed",
      err instanceof Error ? err.message : String(err)
    );
  }
}

export async function notifyNewLead(lead: {
  full_name: string;
  email: string;
  phone?: string | null;
  lead_type?: string | null;
  message?: string | null;
  property_interest?: string | null;
  address?: string | null;
}): Promise<void> {
  await send(`New lead: ${lead.full_name}`, [
    ["Name", lead.full_name],
    ["Email", lead.email],
    ["Phone", lead.phone ?? null],
    ["Type", lead.lead_type ?? null],
    ["Interested in", lead.property_interest ?? null],
    ["Address", lead.address ?? null],
    ["Message", lead.message ?? null],
  ]);
}

export async function notifyNewAppointment(appt: {
  lead_name: string;
  email: string;
  phone?: string | null;
  property?: string | null;
  appointment_date: string;
  appointment_time: string;
}): Promise<void> {
  await send(`New showing request: ${appt.lead_name}`, [
    ["Name", appt.lead_name],
    ["Email", appt.email],
    ["Phone", appt.phone ?? null],
    ["Property", appt.property ?? null],
    ["Date", appt.appointment_date],
    ["Time", appt.appointment_time],
  ]);
}

/**
 * Email a buyer the new listings that match their saved search. Sent by the
 * listing-alerts cron. Returns true only if an email was actually dispatched.
 */
export async function sendListingAlert(
  to: string,
  listings: Array<{ id: string; title: string; price: number; city: string }>,
  baseUrl: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || listings.length === 0) return false;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  try {
    const from = process.env.NOTIFY_FROM || "PropDrive <onboarding@resend.dev>";
    const rows = listings
      .map(
        (l) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e1d6">` +
          `<a href="${baseUrl}/properties/${l.id}" style="color:#15181f;font-weight:600;text-decoration:none">${esc(
            l.title
          )}</a><br>` +
          `<span style="color:#75695b">${esc(currency.format(l.price))} · ${esc(
            l.city
          )}</span></td></tr>`
      )
      .join("");

    const subject =
      listings.length === 1
        ? "A new listing matches your search"
        : `${listings.length} new listings match your search`;

    const header = await brandHeader();
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:520px">
        ${header}
        <h2 style="color:#15181f;margin:0 0 4px">${esc(subject)}</h2>
        <p style="color:#75695b;margin:0 0 16px">Here's what just came on the market for you.</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
        <p style="margin:18px 0 0"><a href="${baseUrl}/properties" style="color:#006aff">Browse all listings</a></p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return res.ok;
  } catch (err) {
    console.error(
      "[notify] sendListingAlert failed",
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}
