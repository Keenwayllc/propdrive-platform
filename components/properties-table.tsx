/**
 * Properties management table for the dashboard. Data fetching + row actions
 * (edit / toggle active / delete) are wired in Phase 2.
 */
import type { Property } from "@/lib/types";

export interface PropertiesTableProps {
  properties?: Property[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PropertiesTable({ properties = [] }: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No properties yet. Add your first listing to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Visible</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{property.title}</td>
              <td className="px-4 py-3 text-slate-600">
                {property.city}, {property.state}
              </td>
              <td className="px-4 py-3 text-slate-600">{currency.format(property.price)}</td>
              <td className="px-4 py-3 capitalize text-slate-600">
                {property.status.replace("_", " ")}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    property.active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {property.active ? "Active" : "Hidden"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
