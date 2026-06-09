/**
 * Neighborhood detail — image hero, live market stats computed from listings,
 * and the actual homes for sale in the area. Dynamic route: `params` is async.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyCard from "@/components/property-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getNeighborhood } from "@/lib/neighborhoods";
import { getPropertiesByArea } from "@/lib/queries";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function deSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const display = getNeighborhood(name)?.name ?? deSlug(name);
  return {
    title: `${display} Homes`,
    description: `Explore homes for sale in ${display}, Los Angeles County.`,
  };
}

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const hood = getNeighborhood(name);
  const display = hood?.name ?? deSlug(name);
  const listings = await getPropertiesByArea(hood?.name ?? display);

  const prices = listings.map((l) => l.price);
  const stats = [
    { label: "Active listings", value: String(listings.length) },
    {
      label: "Median price",
      value: prices.length ? currency.format(median(prices)) : "—",
    },
    {
      label: "Starting from",
      value: prices.length ? currency.format(Math.min(...prices)) : "—",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-ink">
          {hood && (
            <Image
              src={hood.image}
              alt={display}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        </div>

        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6">
          <Reveal>
            <Link
              href="/neighborhoods"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All neighborhoods
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Los Angeles County
            </p>
            <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-white sm:text-6xl">
              {display}
            </h1>
            {hood && (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
                {hood.blurb}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <dl className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-line px-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-7 text-center sm:py-9">
              <dt className="text-xs uppercase tracking-[0.14em] text-faint">
                {s.label}
              </dt>
              <dd className="mt-2 font-mono text-2xl font-semibold text-ink sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Homes in {display}
          </h2>
        </Reveal>

        {listings.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-line bg-surface p-16 text-center text-muted">
            No active listings in {display} right now.{" "}
            <Link href="/properties" className="text-accent hover:underline">
              Browse all listings
            </Link>
            .
          </div>
        ) : (
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((property) => (
              <StaggerItem key={property.id}>
                <PropertyCard property={property} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </div>
  );
}
