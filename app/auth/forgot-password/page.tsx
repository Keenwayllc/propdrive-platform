"use client";

/**
 * Forgot password. Sends a Supabase recovery email whose link lands on
 * /auth/callback (which exchanges the code for a session) and forwards the user
 * to /auth/update-password to set a new one.
 */
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoBadge } from "@/components/logo";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/form-schemas";
import { requestPasswordReset } from "@/lib/auth";

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
    // Always show the same confirmation regardless of whether the account
    // exists (avoids leaking which emails are registered).
    await requestPasswordReset(
      values.email,
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/auth/update-password`
        : undefined
    );
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-ink">
          <LogoBadge size={36} />
          <span className="font-display text-2xl tracking-tight">PropDrive</span>
        </Link>

        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-ink">Check your email</h1>
              <p className="mt-2 text-sm text-muted">
                If an account exists for that address, we&apos;ve sent password
                reset instructions.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="text-xl font-bold text-ink">Reset password</h1>
              <p className="text-sm text-muted">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Email</span>
                <input {...register("email")} type="email" className="form-input" />
                {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-ink px-4 py-2.5 font-semibold text-white hover:bg-accent disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-muted">
                <Link href="/auth/login" className="text-accent hover:underline">
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
