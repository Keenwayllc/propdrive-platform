/**
 * Leads management page. Phase 2 fetches leads and wires status updates.
 */
import LeadsTable from "@/components/leads-table";

export default function DashboardLeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Leads</h1>
      </div>
      {/* TODO(phase-2): fetch leads from Supabase and pass to the table. */}
      <LeadsTable />
    </div>
  );
}
