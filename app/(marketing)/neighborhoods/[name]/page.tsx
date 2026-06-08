/**
 * Neighborhood detail page. Dynamic route — `params` is async.
 * Phase 1 renders the (de-slugged) name; Phase 2 adds stats, listings, and map.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const displayName = fromSlug(name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/neighborhoods"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All neighborhoods
      </Link>

      <h1 className="mt-6 text-4xl font-bold text-slate-900">{displayName}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Neighborhood overview, market statistics, available listings, and a map
        for {displayName} will appear here once connected to the database.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {["Median price", "Active listings", "Avg. days on market"].map((stat) => (
          <div key={stat} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{stat}</p>
            <p className="mt-2 text-2xl font-bold text-slate-400">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
