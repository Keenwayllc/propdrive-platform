"use server";

/**
 * PropDrive — public Server Actions for form submissions.
 *
 * Each action re-validates input with Zod on the server, then inserts via the
 * cookie-aware server client. RLS allows anonymous inserts on leads/appointments.
 */
import { createServerSupabase } from "@/lib/supabase-server";
import { notifyNewLead, notifyNewAppointment } from "@/lib/notify";
import {
  leadFormSchema,
  homeValuationSchema,
  scheduleShowingSchema,
  savedSearchSchema,
  type LeadFormValues,
  type HomeValuationValues,
  type ScheduleShowingValues,
  type SavedSearchInput,
} from "@/lib/form-schemas";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Turn empty strings into null so the DB stores clean values. */
function nullify(value: string | undefined | null): string | null {
  return value && value.trim() !== "" ? value : null;
}

/** Buyer / seller / general / valuation enquiry from the generic lead form. */
export async function submitLead(values: LeadFormValues): Promise<ActionResult> {
  const parsed = leadFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
  const v = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("leads").insert({
    full_name: v.full_name,
    email: v.email,
    phone: nullify(v.phone),
    lead_type: v.lead_type,
    message: nullify(v.message),
    property_interest: nullify(v.property_interest),
    timeline: nullify(v.timeline),
    budget: nullify(v.budget),
    preferred_contact: v.preferred_contact,
  });

  if (error) {
    console.error("[actions] submitLead", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  await notifyNewLead({
    full_name: v.full_name,
    email: v.email,
    phone: v.phone,
    lead_type: v.lead_type,
    message: v.message,
    property_interest: v.property_interest,
  });
  return { ok: true };
}

/** Home valuation request — stored as a seller lead with the address. */
export async function submitValuation(
  values: HomeValuationValues
): Promise<ActionResult> {
  const parsed = homeValuationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
  const v = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("leads").insert({
    full_name: v.full_name,
    email: v.email,
    phone: nullify(v.phone),
    lead_type: "valuation",
    address: v.address,
    timeline: nullify(v.timeline),
    message: nullify(v.message),
    preferred_contact: "email",
  });

  if (error) {
    console.error("[actions] submitValuation", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  await notifyNewLead({
    full_name: v.full_name,
    email: v.email,
    phone: v.phone,
    lead_type: "valuation",
    address: v.address,
    message: v.message,
  });
  return { ok: true };
}

/** Schedule-a-showing request — stored as an appointment. */
export async function submitShowing(
  values: ScheduleShowingValues
): Promise<ActionResult> {
  const parsed = scheduleShowingSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
  const v = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("appointments").insert({
    lead_name: v.lead_name,
    email: v.email,
    phone: nullify(v.phone),
    property: nullify(v.property),
    appointment_date: v.appointment_date,
    appointment_time: v.appointment_time,
    appointment_type: v.appointment_type,
    notes: nullify(v.notes),
  });

  if (error) {
    console.error("[actions] submitShowing", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  await notifyNewAppointment({
    lead_name: v.lead_name,
    email: v.email,
    phone: v.phone,
    property: v.property,
    appointment_date: v.appointment_date,
    appointment_time: v.appointment_time,
  });
  return { ok: true };
}

/** Save a buyer's search so they get emailed when new matching listings appear. */
export async function submitSavedSearch(
  values: SavedSearchInput
): Promise<ActionResult> {
  const parsed = savedSearchSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please enter a valid email address." };
  const v = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("saved_searches").insert({
    email: v.email,
    query: v.query ?? "",
    property_type: v.property_type ?? "any",
    min_price: v.min_price ?? null,
    max_price: v.max_price ?? null,
  });

  if (error) {
    console.error("[actions] submitSavedSearch", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
