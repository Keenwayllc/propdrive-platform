/**
 * Neighborhood detail page. Dynamic route — `params` is async.
 * Phase 1 renders the (de-slugged) name; Phase 2 adds stats, listings, and map.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";

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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Link
        href="/neighborhoods"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All neighborhoods
      </Link>

      <Reveal>
        <h1 className="mt-8 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
          {displayName}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          A full overview of {displayName} — market statistics, available
          listings, and a map — will appear here once connected to the database.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {["Median price", "Active listings", "Avg. days on market"].map((stat) => (
          <div
            key={stat}
            className="rounded-[1.5rem] border border-line bg-surface p-7"
          >
            <p className="text-sm text-muted">{stat}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-faint">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
