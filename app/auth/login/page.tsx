"use client";

/**
 * Agent login. Phase 1 validates input and simulates sign-in. Phase 2 calls
 * the Supabase auth helper and redirects to the dashboard.
 */
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/form-schemas";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setError(null);
    // TODO(phase-2): call signIn() and redirect to /dashboard on success.
    console.info("[login] submit", values.email);
    setError("Authentication is wired up in Phase 2.");
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h1 className="text-xl font-bold text-slate-900">Agent Login</h1>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input {...register("email")} type="email" className="form-input" />
            {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <input {...register("password")} type="password" className="form-input" />
            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
          </label>

          {error && <p className="text-sm text-amber-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-slate-500">
            <Link href="/auth/forgot-password" className="text-blue-700 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
