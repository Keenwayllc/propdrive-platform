"use client";

/**
 * One AI tool: an expandable card with a config-driven form, a Generate button,
 * and the result with a copy button. Disabled until OpenAI is connected.
 */
import { useState } from "react";
import { ChevronDown, Loader2, Copy, Check, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AiToolConfig } from "@/lib/ai-tools-config";
import { runAiTool } from "@/lib/ai-actions";

export default function AiToolCard({
  tool,
  icon: Icon,
  connected,
}: {
  tool: AiToolConfig;
  icon: LucideIcon;
  connected: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function set(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    const res = await runAiTool(tool.id, values);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult(res.text);
  }

  async function onCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-ink">{tool.title}</h3>
              <ChevronDown className="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180" />
            </span>
            <span className="mt-1 block text-sm text-muted">{tool.description}</span>
          </span>
        </summary>

        <div className="mt-5">
          {!connected && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Connect your OpenAI key above to use this tool.
            </p>
          )}

          <form onSubmit={onGenerate} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {tool.fields.map((f) => (
                <label
                  key={f.name}
                  className={`block ${f.type === "textarea" ? "sm:col-span-2" : ""}`}
                >
                  <span className="mb-1 block text-sm font-medium text-ink">
                    {f.label}
                    {f.required && <span className="text-accent"> *</span>}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                      className="form-input"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="form-input"
                    >
                      <option value="">Default</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className="form-input"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={busy || !connected}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy ? "Generating…" : tool.cta}
              </button>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </form>

          {result && (
            <div className="mt-4 rounded-lg border border-line bg-surface/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-faint">
                  Generated
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onGenerate}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-accent"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-accent"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {result}
              </p>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
