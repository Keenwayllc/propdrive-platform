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
  type PropertyInput,
} from "@/lib/form-schemas";
import type { SupabaseClient } from "@supabase/supabase-js";

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

const NOT_AUTHED = "You must be signed in to do that.";

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

  const { data, error } = await supabase
    .from("properties")
    .insert(parsed.data)
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

  const { error } = await supabase
    .from("properties")
    .update(parsed.data)
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
