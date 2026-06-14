"use client";

/**
 * Set a new password. Reached from a recovery email via /auth/callback, which
 * exchanges the link's code for a session — so the browser client already holds
 * a (recovery) session here and updateUser({ password }) can finalise the reset.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogoBadge } from "@/components/logo";
import { supabase } from "@/lib/supabase-client";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string().min(1, "Re-enter the new password."),
  })
  .refine((d) => d.password === d.confirm, {
    message: "The passwords don't match.",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setError(null);
    const { error: err } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (err) {
      setError(
        err.message.includes("session")
          ? "This reset link has expired. Please request a new one."
          : err.message
      );
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-ink">
          <LogoBadge size={36} />
          <span className="font-display text-2xl tracking-tight">PropDrive</span>
        </Link>

        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          {done ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-ink">Password updated</h1>
              <p className="mt-2 text-sm text-muted">
                Taking you to your dashboard…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="text-xl font-bold text-ink">Choose a new password</h1>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  New password
                </span>
                <input
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                  className="form-input"
                />
                {errors.password && (
                  <span className="text-sm text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  Confirm new password
                </span>
                <input
                  {...register("confirm")}
                  type="password"
                  autoComplete="new-password"
                  className="form-input"
                />
                {errors.confirm && (
                  <span className="text-sm text-red-600">
                    {errors.confirm.message}
                  </span>
                )}
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-ink px-4 py-2.5 font-semibold text-white hover:bg-accent disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Update password"}
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
