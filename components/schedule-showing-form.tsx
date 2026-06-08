"use client";

/**
 * Schedule-a-showing form. Captures an appointment request tied to a property.
 * Phase 1: validation + simulated submit. Supabase insert lands in Phase 2.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  scheduleShowingSchema,
  type ScheduleShowingValues,
} from "@/lib/form-schemas";

export interface ScheduleShowingFormProps {
  /** Property title/address pre-filled when launched from a listing page. */
  propertyLabel?: string;
}

export default function ScheduleShowingForm({
  propertyLabel = "",
}: ScheduleShowingFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleShowingValues>({
    resolver: zodResolver(scheduleShowingSchema),
    defaultValues: { property: propertyLabel, appointment_type: "showing" },
  });

  async function onSubmit(values: ScheduleShowingValues) {
    // TODO(phase-2): insert into Supabase `appointments` + notify the agent.
    console.info("[schedule-showing] submit", values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Showing requested!</p>
        <p className="mt-1 text-sm text-green-700">
          We&apos;ll confirm your appointment by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900">Schedule a Showing</h3>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
        <input {...register("lead_name")} className="form-input" placeholder="Your name" />
        {errors.lead_name && (
          <span className="text-sm text-red-600">{errors.lead_name.message}</span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input {...register("email")} type="email" className="form-input" />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
          <input {...register("phone")} type="tel" className="form-input" />
          {errors.phone && (
            <span className="text-sm text-red-600">{errors.phone.message}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Property</span>
        <input {...register("property")} className="form-input" placeholder="Property address" />
        {errors.property && (
          <span className="text-sm text-red-600">{errors.property.message}</span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
          <input {...register("appointment_date")} type="date" className="form-input" />
          {errors.appointment_date && (
            <span className="text-sm text-red-600">{errors.appointment_date.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Time</span>
          <input {...register("appointment_time")} type="time" className="form-input" />
          {errors.appointment_time && (
            <span className="text-sm text-red-600">{errors.appointment_time.message}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
        <textarea {...register("notes")} rows={3} className="form-input" />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {isSubmitting ? "Requesting..." : "Request Showing"}
      </button>
    </form>
  );
}
