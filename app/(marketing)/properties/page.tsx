/**
 * Properties listing page. Renders the filter bar and a results grid.
 * Phase 1 shows an empty state; data fetching from Supabase lands in Phase 2.
 */
import type { Metadata } from "next";
import PropertyFilter from "@/components/property-filter";
import PropertyCard from "@/components/property-card";
import type { Property } from "@/lib/types";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse homes for sale across San Diego County.",
};

export default function PropertiesPage() {
  // TODO(phase-2): fetch active properties from Supabase.
  const properties: Property[] = [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Properties for Sale</h1>
        <p className="mt-1 text-slate-500">
          {properties.length} listings in San Diego County
        </p>
      </header>

      <PropertyFilter />

      {properties.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
          No listings to show yet. Connect Supabase and seed data to populate this page.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
