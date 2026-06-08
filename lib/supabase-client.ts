/**
 * PropDrive — Supabase client setup.
 *
 * Two clients are exposed:
 *  - `supabase`        : browser/anon client, safe for the public site & dashboard reads.
 *  - `createServiceClient()` : server-only client using the service-role key.
 *
 * Phase 1 note: these are configured but no queries are wired yet. Database
 * access logic lands in Phase 2.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface misconfiguration early rather than failing on the first query.
  // In Phase 1 the env vars may be absent during static analysis; we warn
  // instead of throwing so scaffolds still build.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
        "Copy .env.example to .env.local and fill them in."
    );
  }
}

/**
 * Public, anon-key client. Reused across the app to avoid creating multiple
 * GoTrue instances in the browser.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "public-anon-key-placeholder"
);

/**
 * Server-only client with elevated privileges. NEVER import this into a
 * Client Component — the service key must stay on the server.
 */
export function createServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY for the service client."
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
