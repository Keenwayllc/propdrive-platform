/**
 * PropDrive — server-side data access (Server Components / Server Actions).
 *
 * All functions use the cookie-aware server client. Public reads rely on the
 * RLS policies (anon can read active properties + settings); dashboard reads
 * require an authenticated session.
 */
import "server-only";
import { createServerSupabase } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-admin";
import type {
  Appointment,
  BrandSettings,
  Lead,
  Neighborhood,
  Post,
  Property,
  PropertyType,
  SavedSearch,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/* --------------------------------------------------------------- Public reads */

/** Optional filters for the public listings page. */
export interface PropertyFilters {
  query?: string;
  property_type?: PropertyType | "any";
  min_price?: number | null;
  max_price?: number | null;
}

/**
 * Strip characters that are syntactically meaningful inside a PostgREST `.or()`
 * filter string so user input can't corrupt the query.
 */
function sanitizeLike(input: string): string {
  return input.replace(/[,()*.:%]/g, " ").trim();
}

/** Active, public listings ordered featured-first then newest. */
export async function getActiveProperties(
  filters?: PropertyFilters
): Promise<Property[]> {
  const supabase = await createServerSupabase();
  let q = supabase.from("properties").select("*").eq("active", true);

  if (filters?.property_type && filters.property_type !== "any") {
    q = q.eq("property_type", filters.property_type);
  }
  if (typeof filters?.min_price === "number" && Number.isFinite(filters.min_price)) {
    q = q.gte("price", filters.min_price);
  }
  if (typeof filters?.max_price === "number" && Number.isFinite(filters.max_price)) {
    q = q.lte("price", filters.max_price);
  }
  if (filters?.query) {
    const clean = sanitizeLike(filters.query);
    if (clean) {
      const like = `*${clean}*`;
      q = q.or(
        `city.ilike.${like},address.ilike.${like},zip.ilike.${like},title.ilike.${like}`
      );
    }
  }

  const { data, error } = await q
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getActiveProperties", error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

/** Active listings matching an area name (city / address / title contains). */
export async function getPropertiesByArea(area: string): Promise<Property[]> {
  const supabase = await createServerSupabase();
  const like = `*${area}*`;
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .or(`city.ilike.${like},address.ilike.${like},title.ilike.${like}`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getPropertiesByArea", error.message);
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
    .eq("active", true)
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

/** The single brand_settings row (visual identity). */
export async function getBrandSettings(): Promise<BrandSettings | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("brand_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[queries] getBrandSettings", error.message);
    return null;
  }
  return (data as BrandSettings | null) ?? null;
}

/** Active testimonials for the homepage, ordered. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[queries] getTestimonials", error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

/** Active neighborhoods for the public marketing site, ordered. */
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[queries] getNeighborhoods", error.message);
    return [];
  }
  return (data ?? []) as Neighborhood[];
}

/** A single active neighborhood by slug, or null. */
export async function getNeighborhoodBySlug(
  slug: string
): Promise<Neighborhood | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("[queries] getNeighborhoodBySlug", error.message);
    return null;
  }
  return (data as Neighborhood | null) ?? null;
}

/** Published blog / market-insights posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[queries] getPosts", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

/** A single published post by slug, or null. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[queries] getPostBySlug", error.message);
    return null;
  }
  return (data as Post | null) ?? null;
}

/* ------------------------------------------------------ Integration keys */

/** Mask a secret for display: keep the first 5 and last 4 chars. */
function maskKey(key: string): string {
  if (key.length <= 12) return "•".repeat(key.length);
  return `${key.slice(0, 5)}…${key.slice(-4)}`;
}

/**
 * Status of the OpenAI key for the dashboard UI: where it comes from (a key
 * pasted in the dashboard takes precedence over a Vercel env var) and a masked
 * preview. Never returns the full key to the client.
 */
export async function getOpenAiKeyStatus(): Promise<{
  source: "dashboard" | "env" | null;
  masked: string | null;
}> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("integration_settings")
    .select("openai_api_key")
    .eq("id", 1)
    .maybeSingle();

  const dbKey = (data?.openai_api_key as string | null) ?? null;
  if (dbKey) return { source: "dashboard", masked: maskKey(dbKey) };

  const envKey = process.env.OPENAI_API_KEY;
  if (envKey) return { source: "env", masked: maskKey(envKey) };

  return { source: null, masked: null };
}

/**
 * The full OpenAI key for server-side use by the AI tools. Dashboard-stored key
 * wins; falls back to the Vercel env var. SERVER ONLY — never expose.
 *
 * Reads via the service-role client so any signed-in user can run a tool even
 * though integration_settings is admin-locked (the secret stays server-side).
 * Falls back to the user session read when no service key is configured.
 */
export async function getOpenAiKey(): Promise<string | null> {
  const admin = createServiceClient();
  if (admin) {
    const { data } = await admin
      .from("integration_settings")
      .select("openai_api_key")
      .eq("id", 1)
      .maybeSingle();
    return (data?.openai_api_key as string | null) ?? process.env.OPENAI_API_KEY ?? null;
  }

  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("integration_settings")
    .select("openai_api_key")
    .eq("id", 1)
    .maybeSingle();
  return (data?.openai_api_key as string | null) ?? process.env.OPENAI_API_KEY ?? null;
}

/* ----------------------------------------------------------- Dashboard reads */
/* These require an authenticated session (RLS: authenticated full access).    */

/** The signed-in agent's profile name + auth email, or null if signed out. */
export async function getMyProfile(): Promise<{
  full_name: string;
  email: string;
} | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return { full_name: data?.full_name ?? "", email: user.email ?? "" };
}

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

/** All testimonials (incl. inactive) for the dashboard manager. */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[queries] getAllTestimonials", error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

/** All neighborhoods (incl. inactive) for the dashboard manager. */
export async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[queries] getAllNeighborhoods", error.message);
    return [];
  }
  return (data ?? []) as Neighborhood[];
}

/** All posts (incl. drafts) for the dashboard manager. */
export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[queries] getAllPosts", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

/** Saved searches captured from the public site (dashboard view). */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getSavedSearches", error.message);
    return [];
  }
  return (data ?? []) as SavedSearch[];
}
