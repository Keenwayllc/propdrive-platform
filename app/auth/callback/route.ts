/**
 * GET /auth/callback — exchanges the one-time `code` from a Supabase email link
 * (password recovery, email-change confirmation) for a real session cookie, then
 * redirects to `next`. Without this handler, recovery/confirmation links are dead.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Only allow same-origin relative redirects (no open-redirect).
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
      ? next
      : "/dashboard";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error("[auth/callback] exchange failed", error.message);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=link_expired`);
}
