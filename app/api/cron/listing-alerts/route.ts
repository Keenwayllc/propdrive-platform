/**
 * GET /api/cron/listing-alerts — emails buyers when a new listing matches a
 * saved search. Triggered daily by Vercel Cron (see vercel.json).
 *
 * Requires the service-role key (SUPABASE_SERVICE_KEY) to read saved_searches +
 * properties past RLS. If CRON_SECRET is set, the request must present it as a
 * Bearer token (Vercel Cron sends this automatically). No-ops safely if the
 * service key or RESEND_API_KEY isn't configured yet.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase-admin";
import { sendListingAlert } from "@/lib/notify";

interface SavedSearchRow {
  id: string;
  email: string;
  query: string;
  property_type: string;
  min_price: number | null;
  max_price: number | null;
  last_alerted_at: string | null;
  created_at: string;
}

interface PropertyRow {
  id: string;
  title: string;
  price: number;
  city: string;
  property_type: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Service key not configured." },
      { status: 200 }
    );
  }

  const origin = new URL(request.url).origin;

  const { data: searchData } = await admin.from("saved_searches").select("*");
  const searches = (searchData ?? []) as SavedSearchRow[];
  if (searches.length === 0) return NextResponse.json({ ok: true, alerted: 0 });

  const { data: propData } = await admin
    .from("properties")
    .select("id,title,price,city,property_type,created_at")
    .eq("active", true);
  const listings = (propData ?? []) as PropertyRow[];

  let alerted = 0;
  for (const s of searches) {
    const since = s.last_alerted_at ?? s.created_at;
    const q = (s.query ?? "").toLowerCase();
    const matches = listings.filter(
      (p) =>
        p.created_at > since &&
        (s.property_type === "any" || p.property_type === s.property_type) &&
        (s.min_price == null || p.price >= s.min_price) &&
        (s.max_price == null || p.price <= s.max_price) &&
        (!q || `${p.title} ${p.city}`.toLowerCase().includes(q))
    );

    if (matches.length > 0) {
      const sent = await sendListingAlert(
        s.email,
        matches.map((m) => ({ id: m.id, title: m.title, price: m.price, city: m.city })),
        origin
      );
      if (sent) {
        await admin
          .from("saved_searches")
          .update({ last_alerted_at: new Date().toISOString() })
          .eq("id", s.id);
        alerted += 1;
      }
    }
  }

  return NextResponse.json({ ok: true, alerted });
}
