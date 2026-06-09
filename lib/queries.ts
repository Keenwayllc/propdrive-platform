/**
 * PropDrive — server-side data access (Server Components / Server Actions).
 *
 * All functions use the cookie-aware server client. Public reads rely on the
 * RLS policies (anon can read active properties + settings); dashboard reads
 * require an authenticated session.
 */
import "server-only";
import { createServerSupabase } from "@/lib/supabase-server";
import type {
  Appointment,
  Lead,
  Property,
  SiteSettings,
} from "@/lib/types";

/* --------------------------------------------------------------- Public reads */

/** Active, public listings ordered featured-first then newest. */
export async function getActiveProperties(): Promise<Property[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getActiveProperties", error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

/** Featured active listings for the home page. */
export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[queries] getFeaturedProperties", error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

/** A single listing by id, or null if not found / not public. */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[queries] getPropertyById", error.message);
    return null;
  }
  return (data as Property | null) ?? null;
}

/** The single site_settings row (marketing copy). */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[queries] getSiteSettings", error.message);
    return null;
  }
  return (data as SiteSettings | null) ?? null;
}

/* ----------------------------------------------------------- Dashboard reads */
/* These require an authenticated session (RLS: authenticated full access).    */

export async function getAllProperties(): Promise<Property[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getAllProperties", error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getLeads", error.message);
    return [];
  }
  return (data ?? []) as Lead[];
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    console.error("[queries] getAppointments", error.message);
    return [];
  }
  return (data ?? []) as Appointment[];
}

/** Lightweight dashboard counts for the overview cards. */
export async function getDashboardStats(): Promise<{
  newLeads: number;
  upcomingAppointments: number;
  activeListings: number;
}> {
  const supabase = await createServerSupabase();
  const [leads, appts, listings] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .in("status", ["requested", "confirmed"]),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
  ]);

  return {
    newLeads: leads.count ?? 0,
    upcomingAppointments: appts.count ?? 0,
    activeListings: listings.count ?? 0,
  };
}
