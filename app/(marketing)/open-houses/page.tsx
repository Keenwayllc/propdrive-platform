/**
 * Open houses page. Lists upcoming open house events.
 * Phase 1 shows an empty state; Phase 2 pulls events from the database.
 */
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Open Houses",
  description: "Upcoming open houses across San Diego County.",
};

export default function OpenHousesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Open Houses</h1>
        <p className="mt-1 text-slate-500">
          Stop by and tour homes in person this weekend.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
        <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-slate-500">
          No open houses are scheduled right now. Check back soon.
        </p>
      </div>
    </div>
  );
}
