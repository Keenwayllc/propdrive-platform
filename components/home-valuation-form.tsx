"use client";

/**
 * Home valuation request form. Captures a seller lead with the property address.
 * Phase 1: validation + simulated submit; Phase 2 wires Supabase + AVM lookup.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { homeValuationSchema, type HomeValuationValues } from "@/lib/form-schemas";

export default function HomeValuationForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeValuationValues>({
    resolver: zodResolver(homeValuationSchema),
  });

  async function onSubmit(values: HomeValuationValues) {
    // TODO(phase-2): insert seller lead + request automated valuation estimate.
    console.info("[home-valuation] submit", values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Request received!</p>
        <p className="mt-1 text-sm text-green-700">
          We&apos;ll send your personalized home valuation within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900">
        What&apos;s your home worth?
      </h3>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Property address
        </span>
        <input
          {...register("address")}
          className="form-input"
          placeholder="123 Main St, San Diego, CA"
        />
        {errors.address && (
          <span className="text-sm text-red-600">{errors.address.message}</span>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
        <input {...register("full_name")} className="form-input" />
        {errors.full_name && (
          <span className="text-sm text-red-600">{errors.full_name.message}</span>
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
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Timeline to sell
        </span>
        <select {...register("timeline")} className="form-input">
          <option value="">Select...</option>
          <option value="asap">As soon as possible</option>
          <option value="1-3 months">1–3 months</option>
          <option value="3-6 months">3–6 months</option>
          <option value="just curious">Just curious</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Get My Valuation"}
      </button>
    </form>
  );
}
