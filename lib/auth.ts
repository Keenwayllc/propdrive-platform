/**
 * PropDrive — Authentication helpers.
 *
 * Thin wrappers around Supabase Auth. Phase 1 ships the signatures and basic
 * implementations; route protection / middleware is wired in Phase 2.
 */
import { supabase } from "@/lib/supabase-client";
import type { Profile, Result } from "@/lib/types";

/** Sign a user in with email + password. */
export async function signIn(
  email: string,
  password: string
): Promise<Result<{ userId: string }>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { data: null, error: error.message };
    return { data: { userId: data.user.id }, error: null };
  } catch (err) {
    return { data: null, error: toMessage(err) };
  }
}

/** Sign the current user out. */
export async function signOut(): Promise<Result<true>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { data: null, error: error.message };
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: toMessage(err) };
  }
}

/** Send a password-reset email. */
export async function requestPasswordReset(
  email: string,
  redirectTo?: string
): Promise<Result<true>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) return { data: null, error: error.message };
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: toMessage(err) };
  }
}

/** Return the current session's profile id, or null if signed out. */
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/**
 * Placeholder profile loader. Wired to the `profiles` table in Phase 2.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  // TODO(phase-2): query the `profiles` table for the authenticated user.
  return null;
}

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : "An unexpected error occurred.";
}
