"use client";

/**
 * Schedule-a-showing form. Captures an appointment request tied to a property,
 * validates with Zod, and submits via a Server Action.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  scheduleShowingSchema,
  type ScheduleShowingValues,
} from "@/lib/form-schemas";
import { submitShowing } from "@/lib/actions";

export interface ScheduleShowingFormProps {
  /** Property title/address pre-filled when launched from a listing page. */
  propertyLabel?: string;
}

export default function ScheduleShowingForm({
  propertyLabel = "",
}: ScheduleShowingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleShowingValues>({
    resolver: zodResolver(scheduleShowingSchema),
    defaultValues: { property: propertyLabel, appointment_type: "showing" },
  });

  async function onSubmit(values: ScheduleShowingValues) {
    setServerError(null);
    const result = await submitShowing(values);
    if (!result.ok) {
      setServerError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Showing requested!</p>
        <p className="mt-1 text-sm text-green-700">
          We&apos;ll confirm your appointment by email shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            reset({ property: propertyLabel, appointment_type: "showing" });
            setSubmitted(false);
          }}
          className="mt-4 text-sm font-semibold text-green-800 underline-offset-2 hover:underline"
        >
          Schedule another showing
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-[1.5rem] border border-line bg-surface p-6 shadow-[0_24px_50px_-30px_rgba(26,23,20,0.3)] sm:p-7"
    >
      <h3 className="font-display text-xl font-medium tracking-tight text-ink">
        Schedule a Showing
      </h3>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
        <input {...register("lead_name")} className="form-input" placeholder="Your name" />
        {errors.lead_name && (
          <span className="text-sm text-red-600">{errors.lead_name.message}</span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input {...register("email")} type="email" className="form-input" />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
          <input {...register("phone")} type="tel" className="form-input" />
          {errors.phone && (
            <span className="text-sm text-red-600">{errors.phone.message}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Property</span>
        <input {...register("property")} className="form-input" placeholder="Property address" />
        {errors.property && (
          <span className="text-sm text-red-600">{errors.property.message}</span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
          <input {...register("appointment_date")} type="date" className="form-input" />
          {errors.appointment_date && (
            <span className="text-sm text-red-600">{errors.appointment_date.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Time</span>
          <input {...register("appointment_time")} type="time" className="form-input" />
          {errors.appointment_time && (
            <span className="text-sm text-red-600">{errors.appointment_time.message}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Notes</span>
        <textarea {...register("notes")} rows={3} className="form-input" />
      </label>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-ink px-4 py-3 font-semibold text-background transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
      >
        {isSubmitting ? "Requesting..." : "Request Showing"}
      </button>
    </form>
  );
}
