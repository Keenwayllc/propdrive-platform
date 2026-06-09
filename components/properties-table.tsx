/**
 * Properties management table for the dashboard with edit / visibility / delete
 * row actions.
 */
import type { Property } from "@/lib/types";
import PropertyRowActions from "@/components/property-row-actions";

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
      <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
        No properties yet. Add your first listing to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-background text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Visible</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-background">
              <td className="px-4 py-3 font-medium text-ink">{property.title}</td>
              <td className="px-4 py-3 text-muted">
                {property.city}, {property.state}
              </td>
              <td className="px-4 py-3 text-muted">{currency.format(property.price)}</td>
              <td className="px-4 py-3 capitalize text-muted">
                {property.status.replace("_", " ")}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    property.active
                      ? "bg-green-100 text-green-700"
                      : "bg-line text-muted"
                  }`}
                >
                  {property.active ? "Active" : "Hidden"}
                </span>
              </td>
              <td className="px-4 py-3">
                <PropertyRowActions id={property.id} active={property.active} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
