"use client";

/**
 * "Draft with AI" action for a lead row — generates a follow-up email from the
 * lead's real name + interest (already in the DB) and shows it in a small modal
 * with copy + an "open in email app" link.
 */
import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, X } from "lucide-react";
import { runAiTool } from "@/lib/ai-actions";

export default function LeadAiDraft({
  name,
  interest,
  context,
  email,
}: {
  name: string;
  interest: string;
  context: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onDraft() {
    setOpen(true);
    setBusy(true);
    setError(null);
    setText(null);
    const res = await runAiTool("follow-up-email", {
      name,
      interest: interest || "a home in the area",
      context,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setText(res.text);
  }

  async function onCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — no-op
    }
  }

  // Build a mailto from the draft (first "Subject:" line becomes the subject).
  function mailtoHref(): string {
    if (!text) return "#";
    const lines = text.split("\n");
    const subjLine = lines.find((l) => /^subject:/i.test(l.trim()));
    const subject = subjLine ? subjLine.replace(/^subject:\s*/i, "").trim() : "Following up";
    const body = lines.filter((l) => !/^subject:/i.test(l.trim())).join("\n").trim();
    // Encode the address too: lead emails come from a public form, so an
    // unencoded value like "x@x.com?bcc=..." could inject extra mailto headers.
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={onDraft}
        className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong transition-colors hover:bg-accent-soft/70 active:translate-y-px"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Draft with AI
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-ink">
                Follow-up email — {name}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-faint hover:bg-background hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 min-h-[8rem]">
              {busy && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Drafting…
                </div>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {text && (
                <p className="whitespace-pre-wrap rounded-lg border border-line bg-surface/50 p-4 text-sm leading-relaxed text-ink">
                  {text}
                </p>
              )}
            </div>

            {text && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={mailtoHref()}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
                >
                  Open in email app
                </a>
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:text-accent"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onDraft}
                  className="text-sm font-medium text-muted hover:text-accent"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
