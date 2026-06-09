"use client";

/**
 * Inline appointment-status dropdown for the dashboard appointments table.
 */
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AppointmentStatus } from "@/lib/types";
import { setAppointmentStatus } from "@/lib/admin-actions";

const STATUSES: AppointmentStatus[] = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const STYLES: Record<AppointmentStatus, string> = {
  requested: "bg-amber-100 text-amber-700",
  confirmed: "bg-accent-soft text-accent",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-line text-muted",
  no_show: "bg-red-100 text-red-700",
};

export default function AppointmentStatusSelect({
  id,
  status,
}: {
  id: string;
  status: AppointmentStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(async () => {
      await setAppointmentStatus(id, next);
      router.refresh();
    });
  }

  return (
    <select
      aria-label="Appointment status"
      value={status}
      disabled={pending}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 ${STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-ink">
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
