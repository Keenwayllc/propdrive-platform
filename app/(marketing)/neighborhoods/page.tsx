/**
 * Neighborhoods index. Links to individual neighborhood pages.
 * Phase 1 uses a static list; Phase 2 can drive this from the database.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Neighborhoods",
  description: "Explore the neighborhoods of Los Angeles County.",
};

const NEIGHBORHOODS: ReadonlyArray<{ name: string; blurb: string }> = [
  { name: "Beverly Hills", blurb: "Iconic estates, flats, and the 90210 address." },
  { name: "Bel Air", blurb: "Gated privacy and trophy homes above the city." },
  { name: "Santa Monica", blurb: "Beach-close living, walkable, and bright." },
  { name: "Malibu", blurb: "27 miles of coastline, canyons, and ocean views." },
  { name: "Westwood", blurb: "Village energy next to UCLA and the Wilshire corridor." },
  { name: "Pacific Palisades", blurb: "Village charm, bluffs, and family roots." },
  { name: "Calabasas", blurb: "Hidden Hills luxury and gated valley estates." },
  { name: "Brentwood", blurb: "Quiet, leafy, and effortlessly upscale." },
  { name: "Encino", blurb: "Spacious San Fernando Valley living with great value." },
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function NeighborhoodsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Los Angeles County
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Find your corner of the city.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            From the coast to the canyons — the areas that make LA worth calling home.
          </p>
        </header>
      </Reveal>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NEIGHBORHOODS.map((n) => (
          <StaggerItem key={n.name}>
            <Link
              href={`/neighborhoods/${toSlug(n.name)}`}
              className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-line bg-surface p-7 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-xl font-medium tracking-tight text-ink">
                  {n.name}
                </span>
                <ArrowUpRight className="h-5 w-5 text-faint transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted">{n.blurb}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
