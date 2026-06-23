/**
 * Open houses page. Lists active listings that have an upcoming open house
 * (date today or later), grouped by date and linking to each listing. Falls
 * back to an empty state when nothing is scheduled. Open houses are set per
 * listing from the dashboard Properties form.
 */
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import PropertyCard from "@/components/property-card";
import { getSiteSettings, getUpcomingOpenHouses } from "@/lib/queries";
import type { Property } from "@/lib/types";

export const metadata: Metadata = {
  title: "Open Houses",
  description: "Upcoming open houses across Los Angeles County.",
};

/** "2026-06-28" → "Saturday, June 28". */
function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** "13:00" → "1:00 PM". Returns null for blank/unparseable input. */
function formatTime(hhmm: string | null): string | null {
  if (!hhmm) return null;
  const t = new Date(`2000-01-01T${hhmm}`);
  if (Number.isNaN(t.getTime())) return null;
  return t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** A "1:00 PM – 4:00 PM" label from a listing's start/end, or null. */
function timeRange(p: Property): string | null {
  const start = formatTime(p.open_house_start);
  const end = formatTime(p.open_house_end);
  if (start && end) return `${start} – ${end}`;
  return start ?? end;
}

/** Preserve query order (already sorted by date) while grouping by date. */
function groupByDate(properties: Property[]): [string, Property[]][] {
  const groups = new Map<string, Property[]>();
  for (const p of properties) {
    const key = p.open_house_date ?? "";
    if (!key) continue;
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export default async function OpenHousesPage() {
  const [settings, openHouses] = await Promise.all([
    getSiteSettings(),
    getUpcomingOpenHouses(),
  ]);
  const eyebrow = settings?.openhouses_eyebrow?.trim() || "This week";
  const title = settings?.openhouses_title?.trim() || "Open houses";
  const subtitle =
    settings?.openhouses_subtitle?.trim() ||
    "Tour homes in person across Los Angeles County.";

  const groups = groupByDate(openHouses);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <header className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {subtitle}
          </p>
        </header>
      </Reveal>

      {groups.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-line bg-surface p-16 text-center">
            <CalendarDays className="h-10 w-10 text-faint" />
            <p className="mt-4 text-muted">
              No open houses are scheduled right now. Check back soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-12">
          {groups.map(([date, listings]) => (
            <section key={date}>
              <Reveal>
                <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  {formatDate(date)}
                </h2>
              </Reveal>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((property) => {
                  const range = timeRange(property);
                  return (
                    <StaggerItem key={property.id}>
                      {range && (
                        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-accent">
                          <Clock className="h-4 w-4" />
                          {range}
                        </p>
                      )}
                      <PropertyCard property={property} />
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
