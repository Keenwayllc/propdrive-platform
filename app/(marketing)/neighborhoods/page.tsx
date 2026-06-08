/**
 * Neighborhoods index. Links to individual neighborhood pages.
 * Phase 1 uses a static list; Phase 2 can drive this from the database.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Neighborhoods",
  description: "Explore San Diego neighborhoods.",
};

const NEIGHBORHOODS: ReadonlyArray<{ name: string; blurb: string }> = [
  { name: "La Jolla", blurb: "Coastal luxury with sea-cliff views and top schools." },
  { name: "North Park", blurb: "Walkable, artsy, and full of cafes and breweries." },
  { name: "Mission Valley", blurb: "Central, convenient, and growing." },
  { name: "Del Mar", blurb: "Beachside village living with the racetrack and golf." },
  { name: "Downtown San Diego", blurb: "High-rise condos, Gaslamp, and waterfront." },
  { name: "Chula Vista", blurb: "Family-friendly master-planned communities." },
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function NeighborhoodsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">San Diego Neighborhoods</h1>
        <p className="mt-1 text-slate-500">
          Discover the areas that make San Diego County special.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {NEIGHBORHOODS.map((n) => (
          <Link
            key={n.name}
            href={`/neighborhoods/${toSlug(n.name)}`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex items-center gap-2 text-blue-700">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold text-slate-900 group-hover:text-blue-700">
                {n.name}
              </span>
            </span>
            <p className="mt-2 text-sm text-slate-500">{n.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
