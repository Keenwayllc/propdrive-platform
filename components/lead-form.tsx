"use client";

/**
 * Generic lead capture form for buyer / seller / general / valuation enquiries.
 *
 * Phase 1: validates with Zod and simulates submission. The Supabase insert is
 * wired in Phase 2 (see the TODO in `onSubmit`).
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, type LeadFormValues } from "@/lib/form-schemas";
import type { LeadType } from "@/lib/types";

export interface LeadFormProps {
  /** Pre-selects and locks the lead type for context-specific forms. */
  leadType?: LeadType;
  /** Optional heading shown above the form. */
  title?: string;
}

export default function LeadForm({ leadType = "general", title }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { lead_type: leadType, preferred_contact: "email" },
  });

  async function onSubmit(values: LeadFormValues) {
    setServerError(null);
    try {
      // TODO(phase-2): insert into Supabase `leads` and trigger notifications.
      console.info("[lead-form] submit", values);
      setSubmitted(true);
      reset({ lead_type: leadType, preferred_contact: "email" });
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Thank you!</p>
        <p className="mt-1 text-sm text-green-700">
          Your message has been received. An agent will reach out shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-green-800 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}

      <input type="hidden" {...register("lead_type")} />

      <Field label="Full name" error={errors.full_name?.message}>
        <input
          {...register("full_name")}
          className="form-input"
          placeholder="Jane Doe"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className="form-input"
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            className="form-input"
            placeholder="(619) 555-0148"
          />
        </Field>
      </div>

      <Field label="How can we help?" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          className="form-input"
          placeholder="Tell us what you're looking for..."
        />
      </Field>

      <Field label="Preferred contact" error={errors.preferred_contact?.message}>
        <select {...register("preferred_contact")} className="form-input">
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="text">Text</option>
        </select>
      </Field>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}

/** Small labelled field wrapper to keep markup consistent. */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
