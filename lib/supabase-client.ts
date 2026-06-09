/**
 * PropDrive — Supabase browser client (Client Components).
 *
 * Uses @supabase/ssr so the browser client shares the same cookie-based session
 * as the server client and middleware. Safe to import into Client Components.
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Create a browser Supabase client. */
export function createClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/** Shared singleton for convenience in Client Components. */
export const supabase: SupabaseClient = createClient();
