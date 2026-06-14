/**
 * GET /api/leads/export — download all leads as CSV. Auth required; RLS
 * backstops the query, this check just gives a clean 401.
 */
import { createServerSupabase } from "@/lib/supabase-server";

const COLUMNS = [
  "full_name",
  "email",
  "phone",
  "lead_type",
  "status",
  "message",
  "property_interest",
  "timeline",
  "budget",
  "address",
  "preferred_contact",
  "created_at",
] as const;

const HEADERS = [
  "Name",
  "Email",
  "Phone",
  "Type",
  "Status",
  "Message",
  "Property interest",
  "Timeline",
  "Budget",
  "Address",
  "Preferred contact",
  "Received",
];

/**
 * Quote a CSV cell (doubles embedded quotes per RFC 4180) and neutralise CSV
 * formula injection: lead fields come from a public form, so a value starting
 * with = + - @ (or a control char) could execute when opened in Excel/Sheets.
 * Prefixing with a single quote forces it to be treated as text.
 */
function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select(COLUMNS.join(","))
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api] leads export", error.message);
    return new Response("Could not export leads.", { status: 500 });
  }

  const rows = (leads ?? []) as unknown as Array<Record<string, unknown>>;
  const csv = [
    HEADERS.map(cell).join(","),
    ...rows.map((lead) => COLUMNS.map((c) => cell(lead[c])).join(",")),
  ].join("\r\n");

  const today = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
