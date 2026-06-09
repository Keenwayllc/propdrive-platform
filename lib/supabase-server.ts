/**
 * PropDrive — Supabase server client (Server Components, Route Handlers,
 * Server Actions). Cookie-aware via @supabase/ssr so it reads the auth session.
 *
 * `cookies()` is async in this Next version, so this factory is async too.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function createServerSupabase(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Called from a Server Component render where cookies are read-only;
        // the middleware refreshes the session, so swallowing here is safe.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // no-op in read-only contexts
        }
      },
    },
  });
}
