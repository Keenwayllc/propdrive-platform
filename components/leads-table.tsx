/**
 * Leads table for the dashboard. Renders an array of leads; shows an empty
 * state when none are passed. Data fetching is wired in Phase 2.
 */
import type { Lead } from "@/lib/types";

export interface LeadsTableProps {
  leads?: Lead[];
}

const STATUS_STYLES: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-violet-100 text-violet-700",
  closed: "bg-green-100 text-green-700",
  lost: "bg-slate-100 text-slate-600",
};

export default function LeadsTable({ leads = [] }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No leads yet. New enquiries from your site will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{lead.full_name}</td>
              <td className="px-4 py-3 text-slate-600">
                <div>{lead.email}</div>
                {lead.phone && <div className="text-slate-400">{lead.phone}</div>}
              </td>
              <td className="px-4 py-3 capitalize text-slate-600">{lead.lead_type}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
