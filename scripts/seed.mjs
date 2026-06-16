/**
 * One-command demo reset / seeder.
 *
 * Reloads the demo properties and neighborhoods from scripts/seed-data.json into
 * Supabase, so a new owner can get a clean, populated demo in one step (or reset
 * after experimenting). Uses the service-role key, so run it locally only.
 *
 * Usage:
 *   CONFIRM_RESET=yes node scripts/seed.mjs
 *
 * It reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY from your
 * environment or from .env.local / .env. The CONFIRM_RESET guard exists because
 * this DELETES all rows in `properties` and `neighborhoods` before reseeding,
 * so it can never wipe a live database by accident.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Minimal .env loader (no dependency). Later files do not override real env vars.
for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim().replace(/^["']|["']$/g, "");
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY. Set them in .env.local first."
  );
  process.exit(1);
}

if (process.env.CONFIRM_RESET !== "yes") {
  console.error(
    "This will DELETE and reseed the `properties` and `neighborhoods` tables.\n" +
      "Re-run with the confirm flag if you are sure:\n\n" +
      "  CONFIRM_RESET=yes node scripts/seed.mjs\n"
  );
  process.exit(1);
}

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const seed = JSON.parse(readFileSync(join(__dirname, "seed-data.json"), "utf8"));
const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function reseed(table, rows, label) {
  // Delete every existing row (id is never an all-zero uuid).
  const { error: delErr } = await supabase
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw new Error(`clear ${table}: ${delErr.message}`);

  const { error: insErr } = await supabase.from(table).insert(rows);
  if (insErr) throw new Error(`insert ${table}: ${insErr.message}`);
  console.log(`  ${label}: ${rows.length} rows`);
}

try {
  console.log("Reseeding demo content...");

  const neighborhoods = (seed.market?.neighborhoods ?? []).map((n, i) => ({
    name: n.name,
    slug: slugify(n.name),
    blurb: n.blurb,
    image_url: n.image_url ?? "",
    sort_order: i + 1,
    active: true,
  }));
  await reseed("neighborhoods", neighborhoods, "neighborhoods");

  const properties = (seed.properties ?? []).map((p) => ({
    title: p.title,
    address: p.address,
    city: p.city,
    state: p.state,
    zip: p.zip,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    square_feet: p.square_feet,
    lot_size: p.lot_size ?? null,
    property_type: p.property_type,
    status: p.status,
    description: p.description,
    features: p.features ?? [],
    image_urls: p.image_urls ?? [],
    map_address: p.map_address ?? "",
    featured: p.featured ?? false,
    active: p.active ?? true,
  }));
  await reseed("properties", properties, "properties");

  console.log("Done. Reload your site to see the demo content.");
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exit(1);
}
