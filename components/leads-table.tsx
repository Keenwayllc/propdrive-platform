/**
 * Leads table for the dashboard. Renders an array of leads; shows an empty
 * state when none are passed. Data fetching is wired in Phase 2.
 */
import { Inbox } from "lucide-react";
import type { Lead } from "@/lib/types";
import LeadStatusSelect from "@/components/lead-status-select";
import LeadAiDraft from "@/components/lead-ai-draft";

/** Compact context string for the AI follow-up from a lead's stored fields. */
function leadContext(lead: Lead): string {
  return [
    lead.message ? `They wrote: ${lead.message}` : "",
    lead.timeline ? `Timeline: ${lead.timeline}` : "",
    lead.budget ? `Budget: ${lead.budget}` : "",
    lead.preferred_contact ? `Prefers contact by ${lead.preferred_contact}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}

export interface LeadsTableProps {
  leads?: Lead[];
}

export default function LeadsTable({ leads = [] }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Inbox className="h-6 w-6" />
        </span>
        <p className="mt-4 font-medium text-ink">No leads yet</p>
        <p className="mt-1 text-sm text-muted">
          New enquiries from your website will appear here.
        </p>
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
            <th className="px-4 py-3 font-medium">Follow-up</th>
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
              <td className="px-4 py-3">
                <LeadAiDraft
                  name={lead.full_name}
                  interest={lead.property_interest ?? lead.lead_type}
                  context={leadContext(lead)}
                  email={lead.email}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
