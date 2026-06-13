"use client";

/**
 * Small inline "copy to clipboard" button — shows a brief check on success.
 * Used on the Integrations page to copy env-var names.
 */
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (insecure context / permissions) — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`${label} ${value}`}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent active:translate-y-px"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-600" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}
