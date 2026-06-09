/**
 * Leads management page. Phase 2 fetches leads and wires status updates.
 */
import LeadsTable from "@/components/leads-table";
import { getLeads } from "@/lib/queries";

export default async function DashboardLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Leads</h1>
        <span className="text-sm text-muted">{leads.length} total</span>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
