"use client";

/**
 * "Save this home" heart on a listing card. Clicking it opens a small inline
 * panel over the card (no modal) to capture an email, which creates a warm buyer
 * lead tied to this specific property. Lives as a sibling of the card's link so
 * it never triggers navigation.
 */
import { useState } from "react";
import { Heart, Loader2, Check, X } from "lucide-react";
import { saveProperty } from "@/lib/actions";

export default function SavePropertyButton({
  propertyTitle,
}: {
  propertyTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await saveProperty({ email: email.trim(), name, property_title: propertyTitle });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (saved) return;
          setOpen((v) => !v);
        }}
        aria-label={saved ? "Saved" : "Save this home"}
        title={saved ? "Saved" : "Save this home"}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-background"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            saved ? "fill-accent text-accent" : "text-ink"
          }`}
        />
      </button>

      {/* Inline capture panel, contained within the card */}
      {open && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-ink/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={submit}
            className="rounded-2xl border border-line bg-white p-4 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Save this home</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-faint hover:bg-background hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-2.5 text-xs text-muted">
              We&apos;ll keep you posted on this property. No spam.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Your email"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" /> Save this home
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Saved confirmation badge */}
      {saved && (
        <span className="absolute left-3 bottom-3 z-20 inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          <Check className="h-3 w-3" /> Saved
        </span>
      )}
    </>
  );
}
