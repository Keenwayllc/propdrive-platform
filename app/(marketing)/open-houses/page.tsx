/**
 * Open houses page. Lists upcoming open house events.
 * Phase 1 shows an empty state; Phase 2 pulls events from the database.
 */
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Open Houses",
  description: "Upcoming open houses across Los Angeles County.",
};

export default function OpenHousesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <header className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            This week
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Open houses
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Tour homes in person across Los Angeles County.
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-line bg-surface p-16 text-center">
          <CalendarDays className="h-10 w-10 text-faint" />
          <p className="mt-4 text-muted">
            No open houses are scheduled right now. Check back soon.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
