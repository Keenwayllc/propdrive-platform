"use server";

/**
 * PropDrive — authenticated dashboard mutations (CRUD).
 *
 * Every action verifies an authenticated session before writing. RLS also
 * enforces this server-side, so these checks are defense in depth + clean
 * errors. Each mutation revalidates the affected public + dashboard paths.
 */
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  propertyInputSchema,
  leadStatusSchema,
  appointmentStatusSchema,
  siteSettingsSchema,
  brandSettingsSchema,
  profileUpdateSchema,
  emailUpdateSchema,
  passwordUpdateSchema,
  testimonialSchema,
  neighborhoodSchema,
  postSchema,
  pageSchema,
  bannerSchema,
  type PropertyInput,
  type BannerInput,
  type SiteSettingsInput,
  type BrandSettingsInput,
  type ProfileUpdateInput,
  type EmailUpdateInput,
  type PasswordUpdateInput,
  type TestimonialInput,
  type NeighborhoodInput,
  type PostInput,
  type PageInput,
} from "@/lib/form-schemas";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { geocodeAddress, composeAddress } from "@/lib/geocode";

export interface MutationResult {
  ok: boolean;
  error?: string;
  id?: string;
}

/** Returns an authenticated server client, or null if there's no session. */
async function getAuthedClient(): Promise<SupabaseClient | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

/**
 * Returns an authenticated server client only if the signed-in user is an
 * admin, else null. Use for privileged mutations (e.g. storing API secrets)
 * where role matters, not just session presence. RLS enforces the same rule
 * server-side; this gives a clean early error.
 */
async function getAdminClient(): Promise<SupabaseClient | null> {
  const supabase = await getAuthedClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .maybeSingle();
  return data?.role === "admin" ? supabase : null;
}

const NOT_AUTHED = "You must be signed in to do that.";
const NOT_ADMIN = "Only an admin can change integration keys.";

/**
 * Fill missing map coordinates by geocoding the address. Safety net for when the
 * owner types an address by hand instead of picking an autocomplete suggestion,
 * so the property always shows a pin on the map. Never throws — if geocoding
 * fails, the listing just saves without coordinates (no map pin, as before).
 */
async function withCoordinates(input: PropertyInput): Promise<PropertyInput> {
  if (input.lat != null && input.lng != null) return input;
  const coords = await geocodeAddress(composeAddress(input));
  if (!coords) return input;
  return { ...input, lat: coords.lat, lng: coords.lng };
}

function revalidateProperty(id?: string) {
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/dashboard/properties");
  if (id) revalidatePath(`/properties/${id}`);
}

/* ------------------------------------------------------------- Properties */

export async function createProperty(
  input: PropertyInput
): Promise<MutationResult> {
  const parsed = propertyInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form fields." };

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const record = await withCoordinates(parsed.data);
  const { data, error } = await supabase
    .from("properties")
    .insert(record)
    .select("id")
    .single();

  if (error) {
    console.error("[admin] createProperty", error.message);
    return { ok: false, error: "Could not save the listing." };
  }
  revalidateProperty(data.id as string);
  return { ok: true, id: data.id as string };
}

export async function updateProperty(
  id: string,
  input: PropertyInput
): Promise<MutationResult> {
  const parsed = propertyInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form fields." };

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const record = await withCoordinates(parsed.data);
  const { error } = await supabase
    .from("properties")
    .update(record)
    .eq("id", id);

  if (error) {
    console.error("[admin] updateProperty", error.message);
    return { ok: false, error: "Could not update the listing." };
  }
  revalidateProperty(id);
  return { ok: true, id };
}

export async function deleteProperty(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteProperty", error.message);
    return { ok: false, error: "Could not delete the listing." };
  }
  revalidateProperty(id);
  return { ok: true };
}

export async function setPropertyActive(
  id: string,
  active: boolean
): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("properties")
    .update({ active })
    .eq("id", id);
  if (error) return { ok: false, error: "Could not update visibility." };
  revalidateProperty(id);
  return { ok: true };
}

/* ------------------------------------------------------------------ Leads */

export async function setLeadStatus(
  id: string,
  status: string
): Promise<MutationResult> {
  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status." };

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data })
    .eq("id", id);
  if (error) return { ok: false, error: "Could not update the lead." };
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

/* --------------------------------------------------------------- Settings */

/** Update the single site_settings row (marketing copy). */
export async function updateSiteSettings(
  input: SiteSettingsInput
): Promise<MutationResult> {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("site_settings").update(parsed.data).eq("id", existing.id)
    : await supabase.from("site_settings").insert(parsed.data);

  if (error) {
    console.error("[admin] updateSiteSettings", error.message);
    return { ok: false, error: "Could not save settings." };
  }
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/website-editor");
  return { ok: true };
}

/** Update the single brand_settings row (visual identity). */
export async function updateBrandSettings(
  input: BrandSettingsInput
): Promise<MutationResult> {
  const parsed = brandSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data: existing } = await supabase
    .from("brand_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("brand_settings").update(parsed.data).eq("id", existing.id)
    : await supabase.from("brand_settings").insert(parsed.data);

  if (error) {
    console.error("[admin] updateBrandSettings", error.message);
    return { ok: false, error: "Could not save branding." };
  }
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/branding");
  return { ok: true };
}

/** Update the signed-in agent's profile. */
export async function updateProfile(
  input: ProfileUpdateInput
): Promise<MutationResult> {
  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the fields." };

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (error) {
    console.error("[admin] updateProfile", error.message);
    return { ok: false, error: "Could not save your profile." };
  }
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

/**
 * Change the signed-in agent's login email. Supabase sends a confirmation
 * link to the NEW address; the change only takes effect once they click it.
 */
export async function updateEmail(
  input: EmailUpdateInput
): Promise<MutationResult> {
  const parsed = emailUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: NOT_AUTHED };
  if (user.email?.toLowerCase() === parsed.data.email.toLowerCase()) {
    return { ok: false, error: "That's already your email address." };
  }

  const { error } = await supabase.auth.updateUser({ email: parsed.data.email });
  if (error) {
    console.error("[admin] updateEmail", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Change the signed-in agent's password. Verifies the current password first
 * (via a throwaway stateless client so the live session cookies are untouched),
 * then sets the new one.
 */
export async function updatePassword(
  input: PasswordUpdateInput
): Promise<MutationResult> {
  const parsed = passwordUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: NOT_AUTHED };

  // Verify the current password without disturbing the cookie session.
  const verifier = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { error: verifyError } = await verifier.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.current_password,
  });
  if (verifyError) {
    return { ok: false, error: "Your current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });
  if (error) {
    console.error("[admin] updatePassword", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ----------------------------------------------------- Integration keys */

/**
 * Save the OpenAI API key into integration_settings (single row). Lets a
 * non-technical owner connect OpenAI from the dashboard instead of editing
 * Vercel env vars. Stored server-side under RLS; never returned to the client
 * in full. Basic shape check only — OpenAI keys start with "sk-".
 */
export async function saveOpenAiKey(key: string): Promise<MutationResult> {
  const trimmed = key.trim();
  if (!trimmed.startsWith("sk-") || trimmed.length < 20) {
    return { ok: false, error: "That doesn't look like an OpenAI key (starts with “sk-”)." };
  }

  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: NOT_ADMIN };

  const { error } = await supabase
    .from("integration_settings")
    .upsert({ id: 1, openai_api_key: trimmed, updated_at: new Date().toISOString() });

  if (error) {
    console.error("[admin] saveOpenAiKey", error.message);
    return { ok: false, error: "Could not save the key." };
  }
  revalidatePath("/dashboard/integrations");
  revalidatePath("/dashboard/ai-tools");
  return { ok: true };
}

/** Remove the stored OpenAI key (revert to the Vercel env var, if any). */
export async function clearOpenAiKey(): Promise<MutationResult> {
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: NOT_ADMIN };

  const { error } = await supabase
    .from("integration_settings")
    .upsert({ id: 1, openai_api_key: null, updated_at: new Date().toISOString() });

  if (error) {
    console.error("[admin] clearOpenAiKey", error.message);
    return { ok: false, error: "Could not remove the key." };
  }
  revalidatePath("/dashboard/integrations");
  revalidatePath("/dashboard/ai-tools");
  return { ok: true };
}

/** Sign the agent out of every device/session (global scope). */
export async function signOutEverywhere(): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) {
    console.error("[admin] signOutEverywhere", error.message);
    return { ok: false, error: "Could not sign out other sessions." };
  }
  return { ok: true };
}

/* ----------------------------------------------------------- Appointments */

export async function setAppointmentStatus(
  id: string,
  status: string
): Promise<MutationResult> {
  const parsed = appointmentStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status." };

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("appointments")
    .update({ status: parsed.data })
    .eq("id", id);
  if (error) return { ok: false, error: "Could not update the appointment." };
  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true };
}

/* --------------------------------------------------------- Testimonials */

/* ----------------------------------------------------------------- Banners */

function revalidateBanners() {
  revalidatePath("/");
  revalidatePath("/dashboard/banners");
}

export async function createBanner(input: BannerInput): Promise<MutationResult> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data, error } = await supabase
    .from("banners")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) {
    console.error("[admin] createBanner", error.message);
    return { ok: false, error: "Could not add the banner." };
  }
  revalidateBanners();
  return { ok: true, id: data.id as string };
}

export async function updateBanner(
  id: string,
  input: BannerInput
): Promise<MutationResult> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("banners").update(parsed.data).eq("id", id);
  if (error) {
    console.error("[admin] updateBanner", error.message);
    return { ok: false, error: "Could not update the banner." };
  }
  revalidateBanners();
  return { ok: true, id };
}

export async function deleteBanner(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteBanner", error.message);
    return { ok: false, error: "Could not delete the banner." };
  }
  revalidateBanners();
  return { ok: true };
}

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
}

export async function createTestimonial(
  input: TestimonialInput
): Promise<MutationResult> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data, error } = await supabase
    .from("testimonials")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) {
    console.error("[admin] createTestimonial", error.message);
    return { ok: false, error: "Could not add the testimonial." };
  }
  revalidateTestimonials();
  return { ok: true, id: data.id as string };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput
): Promise<MutationResult> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("testimonials")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    console.error("[admin] updateTestimonial", error.message);
    return { ok: false, error: "Could not update the testimonial." };
  }
  revalidateTestimonials();
  return { ok: true, id };
}

export async function deleteTestimonial(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteTestimonial", error.message);
    return { ok: false, error: "Could not delete the testimonial." };
  }
  revalidateTestimonials();
  return { ok: true };
}

/* --------------------------------------------------------- Neighborhoods */

function revalidateNeighborhoods() {
  revalidatePath("/", "layout");
  revalidatePath("/neighborhoods");
  revalidatePath("/dashboard/neighborhoods");
}

export async function createNeighborhood(
  input: NeighborhoodInput
): Promise<MutationResult> {
  const parsed = neighborhoodSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data, error } = await supabase
    .from("neighborhoods")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) {
    console.error("[admin] createNeighborhood", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not add the neighborhood.";
    return { ok: false, error: msg };
  }
  revalidateNeighborhoods();
  return { ok: true, id: data.id as string };
}

export async function updateNeighborhood(
  id: string,
  input: NeighborhoodInput
): Promise<MutationResult> {
  const parsed = neighborhoodSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase
    .from("neighborhoods")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    console.error("[admin] updateNeighborhood", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not update the neighborhood.";
    return { ok: false, error: msg };
  }
  revalidateNeighborhoods();
  return { ok: true, id };
}

export async function deleteNeighborhood(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("neighborhoods").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteNeighborhood", error.message);
    return { ok: false, error: "Could not delete the neighborhood." };
  }
  revalidateNeighborhoods();
  return { ok: true };
}

/* ---------------------------------------------------- Blog / Market Insights */

function revalidatePosts(slug?: string) {
  revalidatePath("/insights");
  revalidatePath("/dashboard/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
}

export async function createPost(input: PostInput): Promise<MutationResult> {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data, error } = await supabase
    .from("posts")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) {
    console.error("[admin] createPost", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not create the post.";
    return { ok: false, error: msg };
  }
  revalidatePosts(parsed.data.slug);
  return { ok: true, id: data.id as string };
}

export async function updatePost(
  id: string,
  input: PostInput
): Promise<MutationResult> {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("posts").update(parsed.data).eq("id", id);
  if (error) {
    console.error("[admin] updatePost", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not update the post.";
    return { ok: false, error: msg };
  }
  revalidatePosts(parsed.data.slug);
  return { ok: true, id };
}

export async function deletePost(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("[admin] deletePost", error.message);
    return { ok: false, error: "Could not delete the post." };
  }
  revalidatePosts();
  return { ok: true };
}

/* ------------------------------------------------------- Custom pages */

function revalidatePages(slug?: string) {
  // Pages surface in the site-wide nav/footer, so refresh the whole layout.
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/pages");
  if (slug) revalidatePath(`/p/${slug}`);
}

export async function createPage(input: PageInput): Promise<MutationResult> {
  const parsed = pageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { data, error } = await supabase
    .from("pages")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) {
    console.error("[admin] createPage", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not create the page.";
    return { ok: false, error: msg };
  }
  revalidatePages(parsed.data.slug);
  return { ok: true, id: data.id as string };
}

export async function updatePage(
  id: string,
  input: PageInput
): Promise<MutationResult> {
  const parsed = pageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("pages").update(parsed.data).eq("id", id);
  if (error) {
    console.error("[admin] updatePage", error.message);
    const msg = error.message.includes("duplicate")
      ? "That slug is already used. Pick a unique one."
      : "Could not update the page.";
    return { ok: false, error: msg };
  }
  revalidatePages(parsed.data.slug);
  return { ok: true, id };
}

export async function deletePage(id: string): Promise<MutationResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: NOT_AUTHED };

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) {
    console.error("[admin] deletePage", error.message);
    return { ok: false, error: "Could not delete the page." };
  }
  revalidatePages();
  return { ok: true };
}
