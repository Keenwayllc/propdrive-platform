import "server-only";

/**
 * Service-role Supabase client — bypasses RLS for trusted server-only work
 * (e.g. resolving the stored OpenAI key so any signed-in user can run AI tools
 * while the integration_settings table stays admin-locked). NEVER import this
 * into client code; the service key must never reach the browser.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
