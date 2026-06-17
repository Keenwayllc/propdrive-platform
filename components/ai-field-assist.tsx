"use client";

/**
 * Small "Write with AI" helper that sits next to a single text field. Click it
 * to open a tiny popover, optionally type guidance, and generate or improve the
 * field's copy. Calls the generic assistField server action and hands the result
 * back to the parent via onResult. Disabled (with a hint) until OpenAI is
 * connected, matching the rest of the dashboard.
 */
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, HelpCircle } from "lucide-react";
import { assistField } from "@/lib/ai-actions";

export default function AiFieldAssist({
  instruction,
  getCurrent,
  getContext,
  onResult,
  aiConnected,
  maxTokens,
  label = "Write with AI",
}: {
  /** What the field is for, passed to the AI. */
  instruction: string;
  /** Returns the field's current text (to improve), if any. */
  getCurrent?: () => string;
  /** Returns brand/context to ground the copy. */
  getContext?: () => string;
  /** Receives the generated text. */
  onResult: (text: string) => void;
  aiConnected: boolean;
  maxTokens?: number;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [guidance, setGuidance] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setErr(null);
    const res = await assistField({
      instruction,
      current: getCurrent?.() ?? "",
      context: getContext?.() ?? "",
      guidance,
      maxTokens,
    });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    onResult(res.text);
    setOpen(false);
    setGuidance("");
  }

  if (!aiConnected) {
    return (
      <Link
        href="/dashboard/ai-assistant"
        title="Connect your OpenAI key under AI Assistant to turn this on"
        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
      >
        <Sparkles className="h-3.5 w-3.5" /> AI off
      </Link>
    );
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong transition-colors hover:bg-accent-soft/70 active:translate-y-px"
      >
        <Sparkles className="h-3.5 w-3.5" /> {label}
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-72 rounded-xl border border-line bg-white p-3 shadow-xl">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Sparkles className="h-3.5 w-3.5 text-accent-strong" /> Write with AI
            <span className="group relative ml-auto inline-flex">
              <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted" tabIndex={0} aria-label="How it works" />
              <span className="pointer-events-none absolute right-0 top-5 z-40 w-56 rounded-lg bg-ink px-2.5 py-2 text-[11px] font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                Leave blank to let AI write or polish this field, or add a hint
                like &quot;more upbeat&quot; or &quot;mention 20 years
                experience&quot;, then Generate.
              </span>
            </span>
          </div>
          <textarea
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
            rows={2}
            placeholder="Optional hint, e.g. warmer and shorter"
            className="form-input text-sm"
          />
          {err && <p className="mt-1.5 text-xs text-red-600">{err}</p>}
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1 text-xs font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Writing…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Generate
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
