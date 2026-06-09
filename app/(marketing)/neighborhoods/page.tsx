/**
 * Neighborhoods index — an editorial grid of image-led neighborhood tiles.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export const metadata: Metadata = {
  title: "Neighborhoods",
  description: "Explore the neighborhoods of Los Angeles County.",
};

export default function NeighborhoodsPage() {
  const [featured, ...rest] = NEIGHBORHOODS;

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
            From the coast to the canyons, the areas that make LA worth calling home.
          </p>
        </header>
      </Reveal>

      {/* Featured neighborhood */}
      <Reveal>
        <Link
          href={`/neighborhoods/${featured.slug}`}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-line bg-ink sm:aspect-[21/9]"
        >
          <Image
            src={featured.image}
            alt={featured.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-85 transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {featured.name}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
              {featured.blurb}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              View homes
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </Reveal>

      {/* The rest */}
      <Stagger className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {rest.map((n) => (
          <StaggerItem key={n.slug}>
            <Link
              href={`/neighborhoods/${n.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink"
            >
              <Image
                src={n.image}
                alt={n.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-80 transition-transform duration-[600ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <h3 className="font-display text-lg font-medium leading-tight text-white">
                  {n.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/70">
                  {n.blurb}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
