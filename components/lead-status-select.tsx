"use client";

/**
 * Inline lead-status dropdown for the dashboard leads table. Persists via the
 * auth-guarded Server Action and refreshes the route on change.
 */
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/lib/types";
import { setLeadStatus } from "@/lib/admin-actions";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed", "lost"];

const STYLES: Record<LeadStatus, string> = {
  new: "bg-accent-soft text-accent",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-teal-100 text-teal-700",
  closed: "bg-green-100 text-green-700",
  lost: "bg-line text-muted",
};

export default function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(async () => {
      await setLeadStatus(id, next);
      router.refresh();
    });
  }

  return (
    <select
      aria-label="Lead status"
      value={status}
      disabled={pending}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 ${STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-ink">
          {s}
        </option>
      ))}
    </select>
  );
}
