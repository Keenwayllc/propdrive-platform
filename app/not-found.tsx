/**
 * Global 404 — on-brand "Coastal Luxe" not-found page.
 */
import Link from "next/link";
import { Home, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 font-semibold text-ink"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background">
          <Home className="h-5 w-5" />
        </span>
        PropDrive
      </Link>

      <p className="font-mono text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 max-w-md font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        This page took a wrong turn.
      </h1>
      <p className="mt-4 max-w-sm text-muted">
        The listing or page you&apos;re looking for isn&apos;t here. It may have
        sold, moved, or never existed.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/properties"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
        >
          Browse listings
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface active:translate-y-px"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
