"use client";

/**
 * Filter bar for the properties listing page.
 *
 * State lives in the URL query string (?q / ?type / ?min / ?max) so the server
 * component can read it, re-query Supabase, and render the filtered results.
 * Text input is debounced; selects/number fields commit on change.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { PropertyType } from "@/lib/types";

export interface PropertyFilters {
  query: string;
  property_type: PropertyType | "any";
  min_price: number | null;
  max_price: number | null;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  query: "",
  property_type: "any",
  min_price: null,
  max_price: null,
};

const PROPERTY_TYPE_OPTIONS: ReadonlyArray<{ value: PropertyType | "any"; label: string }> = [
  { value: "any", label: "Any type" },
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

export default function PropertyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    query: searchParams.get("q") ?? "",
    property_type: (searchParams.get("type") as PropertyType | "any") || "any",
    min_price: searchParams.get("min") ? Number(searchParams.get("min")) : null,
    max_price: searchParams.get("max") ? Number(searchParams.get("max")) : null,
  }));

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the pending debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  function commit(next: PropertyFilters) {
    const params = new URLSearchParams();
    if (next.query.trim()) params.set("q", next.query.trim());
    if (next.property_type !== "any") params.set("type", next.property_type);
    if (next.min_price != null) params.set("min", String(next.min_price));
    if (next.max_price != null) params.set("max", String(next.max_price));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function update<K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
    { debounced = false }: { debounced?: boolean } = {}
  ) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (debounce.current) clearTimeout(debounce.current);
    if (debounced) {
      debounce.current = setTimeout(() => commit(next), 350);
    } else {
      commit(next);
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-line bg-surface p-4 shadow-[0_18px_40px_-30px_rgba(26,23,20,0.3)]">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            aria-label="Search by city, address, or ZIP"
            value={filters.query}
            onChange={(e) => update("query", e.target.value, { debounced: true })}
            placeholder="City, address, or ZIP"
            className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <select
          aria-label="Property type"
          value={filters.property_type}
          onChange={(e) =>
            update("property_type", e.target.value as PropertyType | "any")
          }
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          {PROPERTY_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          value={filters.min_price ?? ""}
          onChange={(e) =>
            update("min_price", e.target.value ? Number(e.target.value) : null, {
              debounced: true,
            })
          }
          placeholder="Min price"
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />

        <input
          type="number"
          min={0}
          value={filters.max_price ?? ""}
          onChange={(e) =>
            update("max_price", e.target.value ? Number(e.target.value) : null, {
              debounced: true,
            })
          }
          placeholder="Max price"
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
}
