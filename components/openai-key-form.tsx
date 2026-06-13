"use client";

/**
 * Self-serve OpenAI key entry — lets a non-technical owner connect OpenAI from
 * the dashboard (stored securely server-side) instead of editing Vercel env
 * vars. Shows only a masked preview of any existing key; the full value is
 * never sent back to the browser.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { saveOpenAiKey, clearOpenAiKey } from "@/lib/admin-actions";

export default function OpenAiKeyForm({
  source,
  masked,
}: {
  source: "dashboard" | "env" | null;
  masked: string | null;
}) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await saveOpenAiKey(key);
    setBusy(false);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Could not save the key.");
      return;
    }
    setStatus("saved");
    setMessage("Key saved. OpenAI is connected.");
    setKey("");
    router.refresh();
  }

  async function onRemove() {
    setBusy(true);
    setMessage(null);
    const result = await clearOpenAiKey();
    setBusy(false);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Could not remove the key.");
      return;
    }
    setStatus("idle");
    setMessage(null);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
            source ? "bg-accent-soft text-accent" : "bg-line text-faint"
          }`}
        >
          <Sparkles className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-ink">Connect OpenAI</h2>
            {source && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            Paste your OpenAI key to power the AI tools below — no Vercel needed.
            Stored securely; we only ever show a masked preview.
          </p>

          {source && masked && (
            <p className="mt-3 text-sm text-ink">
              Current key:{" "}
              <code className="rounded bg-surface/70 px-1.5 py-0.5 text-xs">
                {masked}
              </code>{" "}
              <span className="text-faint">
                ({source === "dashboard" ? "added here" : "from Vercel env var"})
              </span>
            </p>
          )}

          <form onSubmit={onSave} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {source ? "Replace key" : "OpenAI API key"}
              </span>
              <input
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setStatus("idle");
                }}
                placeholder="sk-..."
                autoComplete="off"
                className="form-input font-mono"
              />
            </label>

            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              Get a key from OpenAI
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={busy || !key.trim()}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save key"}
              </button>
              {source === "dashboard" && (
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={busy}
                  className="text-sm font-medium text-muted hover:text-red-600 disabled:opacity-60"
                >
                  Remove key
                </button>
              )}
              {status === "saved" && message && (
                <span className="text-sm font-medium text-green-600">{message}</span>
              )}
              {status === "error" && message && (
                <span className="text-sm text-red-600">{message}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
