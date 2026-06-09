/**
 * Leads table for the dashboard. Renders an array of leads; shows an empty
 * state when none are passed. Data fetching is wired in Phase 2.
 */
import type { Lead } from "@/lib/types";
import LeadStatusSelect from "@/components/lead-status-select";

export interface LeadsTableProps {
  leads?: Lead[];
}

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
                <LeadStatusSelect id={lead.id} status={lead.status} />
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
