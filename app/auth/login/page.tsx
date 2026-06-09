"use client";

/**
 * Agent login. Phase 1 validates input and simulates sign-in. Phase 2 calls
 * the Supabase auth helper and redirects to the dashboard.
 */
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/form-schemas";
import { signIn } from "@/lib/auth";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only allow same-origin relative paths to prevent open-redirect attacks
  // (reject absolute URLs, "//evil.com", and "/\evil.com" variants).
  const rawRedirect = searchParams.get("redirect") ?? "/dashboard";
  const redirectTo =
    rawRedirect.startsWith("/") &&
    !rawRedirect.startsWith("//") &&
    !rawRedirect.startsWith("/\\")
      ? rawRedirect
      : "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setError(null);
    const result = await signIn(values.email, values.password);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    router.push(redirectTo);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
            <Home className="h-5 w-5" />
          </span>
          PropDrive
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-line bg-white p-8 shadow-sm"
        >
          <h1 className="text-xl font-bold text-ink">Agent Login</h1>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Email</span>
            <input {...register("email")} type="email" className="form-input" />
            {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Password</span>
            <input {...register("password")} type="password" className="form-input" />
            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
          </label>

          {error && <p className="text-sm text-amber-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-ink px-4 py-2.5 font-semibold text-white hover:bg-accent disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-muted">
            <Link href="/auth/forgot-password" className="text-accent hover:underline">
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
