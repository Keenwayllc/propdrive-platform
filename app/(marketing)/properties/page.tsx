/**
 * Properties listing page. Renders the filter bar and a results grid.
 * Filters are driven by the URL query string (?q / ?type / ?min / ?max),
 * read here and applied server-side in getActiveProperties().
 */
import type { Metadata } from "next";
import PropertyFilter from "@/components/property-filter";
import PropertyCard from "@/components/property-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getActiveProperties } from "@/lib/queries";
import type { PropertyType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse homes for sale across Los Angeles County.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; min?: string; max?: string }>;
}) {
  const sp = await searchParams;
  const min = sp.min ? Number(sp.min) : null;
  const max = sp.max ? Number(sp.max) : null;
  const properties = await getActiveProperties({
    query: sp.q,
    property_type: (sp.type as PropertyType | "any") || "any",
    min_price: Number.isFinite(min) ? min : null,
    max_price: Number.isFinite(max) ? max : null,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <Reveal>
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            For sale
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Homes across Los Angeles
          </h1>
          <p className="mt-3 text-muted">
            {properties.length} listings in Los Angeles County
          </p>
        </header>
      </Reveal>

      <div className="sticky top-20 z-30">
        <PropertyFilter />
      </div>

      {properties.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-line bg-surface p-16 text-center text-muted">
          No listings match right now. Check back soon or{" "}
          <a href="/contact" className="text-accent hover:underline">
            tell us what you&apos;re looking for
          </a>
          .
        </div>
      ) : (
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
