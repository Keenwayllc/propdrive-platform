/**
 * Leads table for the dashboard. Renders an array of leads; shows an empty
 * state when none are passed. Data fetching is wired in Phase 2.
 */
import type { Lead } from "@/lib/types";

export interface LeadsTableProps {
  leads?: Lead[];
}

const STATUS_STYLES: Record<Lead["status"], string> = {
  new: "bg-accent-soft text-accent",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-teal-100 text-teal-700",
  closed: "bg-green-100 text-green-700",
  lost: "bg-line text-muted",
};

export default function LeadsTable({ leads = [] }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
        No leads yet. New enquiries from your site will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-background text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-background">
              <td className="px-4 py-3 font-medium text-ink">{lead.full_name}</td>
              <td className="px-4 py-3 text-muted">
                <div>{lead.email}</div>
                {lead.phone && <div className="text-faint">{lead.phone}</div>}
              </td>
              <td className="px-4 py-3 capitalize text-muted">{lead.lead_type}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
