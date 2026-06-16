"use client";

/**
 * "Get alerts" capture on the Properties page. Saves the visitor's email plus
 * the currently-applied filters so the owner can email them when a new matching
 * listing is added. A lightweight lead magnet.
 */
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BellRing, Check } from "lucide-react";
import { submitSavedSearch } from "@/lib/actions";

export default function SaveSearchForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const res = await submitSavedSearch({
      email: email.trim(),
      query: searchParams.get("q") ?? "",
      property_type: searchParams.get("type") ?? "any",
      min_price: min ? Number(min) : null,
      max_price: max ? Number(max) : null,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
        <Check className="h-4 w-4" />
        You&apos;re set. We&apos;ll email you when a new matching listing is added.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <BellRing className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Get new-listing alerts</p>
          <p className="text-xs text-muted">
            We&apos;ll email you when a home matching your current filters is added.
          </p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email for listing alerts"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 sm:w-56"
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
        >
          {busy ? "Saving…" : "Notify me"}
        </button>
      </div>
    </form>
  );
}
