/**
 * Saved searches — buyers who asked to be alerted when new matching listings
 * appear. Read-only list (a warm lead list the owner can follow up on).
 */
import Link from "next/link";
import { Info } from "lucide-react";
import { getSavedSearches } from "@/lib/queries";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const fmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function criteria(s: {
  query: string;
  property_type: string;
  min_price: number | null;
  max_price: number | null;
}): string {
  const parts: string[] = [];
  if (s.query) parts.push(`"${s.query}"`);
  if (s.property_type && s.property_type !== "any")
    parts.push(s.property_type.replace(/_/g, " "));
  if (s.min_price != null) parts.push(`min ${currency.format(s.min_price)}`);
  if (s.max_price != null) parts.push(`max ${currency.format(s.max_price)}`);
  return parts.length ? parts.join(" · ") : "Any listing";
}

export default async function SavedSearchesPage() {
  const searches = await getSavedSearches();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Saved searches</h1>
        <p className="mt-1 text-sm text-muted">
          Buyers who asked to be emailed when a new matching listing is added.
          They are alerted automatically, and this is a warm list you can follow
          up on directly.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent-soft/40 p-4 text-sm text-ink">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
        <p className="leading-relaxed">
          This page is for buyers who saved a <span className="font-medium">search</span>{" "}
          (ongoing alerts). When someone clicks{" "}
          <span className="font-medium">Save this home</span> on a specific
          listing, that is a hotter, direct lead, so it appears under{" "}
          <Link href="/dashboard/leads" className="font-medium text-accent hover:underline">
            Leads
          </Link>{" "}
          instead, tagged with the property they saved.
        </p>
      </div>

      {searches.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-line bg-surface p-12 text-center text-muted">
          No saved searches yet. When visitors save a search on your Properties
          page, they show up here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-surface/60 text-left text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Criteria</th>
                <th className="px-5 py-3 font-semibold">Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {searches.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-medium text-ink">
                    <a href={`mailto:${encodeURIComponent(s.email)}`} className="hover:text-accent">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-muted">{criteria(s)}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted">
                    {fmt.format(new Date(s.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
