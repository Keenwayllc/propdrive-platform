"use client";

/**
 * Triggers the browser's print dialog, which doubles as "Save as PDF" on every
 * modern browser. Hidden when the page is actually printing (see `print:hidden`).
 */
import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
