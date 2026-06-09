"use client";

/**
 * Filter bar for the properties listing page.
 * Phase 1: controlled UI only. The `onChange` callback emits the current
 * filter state so the parent can wire it to data fetching in Phase 2.
 */
import { useState } from "react";
import { Search } from "lucide-react";
import type { PropertyType } from "@/lib/types";

export interface PropertyFilters {
  query: string;
  property_type: PropertyType | "any";
  min_price: number | null;
  max_price: number | null;
  bedrooms: number | null;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  query: "",
  property_type: "any",
  min_price: null,
  max_price: null,
  bedrooms: null,
};

export interface PropertyFilterProps {
  onChange?: (filters: PropertyFilters) => void;
}

const PROPERTY_TYPE_OPTIONS: ReadonlyArray<{ value: PropertyType | "any"; label: string }> = [
  { value: "any", label: "Any type" },
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

export default function PropertyFilter({ onChange }: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  function update<K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onChange?.(next);
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
            onChange={(e) => update("query", e.target.value)}
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
            update("min_price", e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Min price"
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />

        <input
          type="number"
          min={0}
          value={filters.max_price ?? ""}
          onChange={(e) =>
            update("max_price", e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Max price"
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
}
