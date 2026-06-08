"use client";

/**
 * Forgot password. Phase 1 validates the email and simulates the reset request.
 * Phase 2 calls the Supabase password-reset helper.
 */
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/form-schemas";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordValues) {
    // TODO(phase-2): call requestPasswordReset(values.email).
    console.info("[forgot-password] submit", values.email);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Home className="h-5 w-5" />
          </span>
          PropDrive
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
              <p className="mt-2 text-sm text-slate-500">
                If an account exists for that address, we&apos;ve sent password
                reset instructions.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="text-xl font-bold text-slate-900">Reset password</h1>
              <p className="text-sm text-slate-500">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                <input {...register("email")} type="email" className="form-input" />
                {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-slate-500">
                <Link href="/auth/login" className="text-blue-700 hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
