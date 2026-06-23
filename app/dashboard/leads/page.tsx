/**
 * Leads management page. Fetches leads, supports CSV export and status updates.
 */
import { Download } from "lucide-react";
import LeadsTable from "@/components/leads-table";
import { getLeads } from "@/lib/queries";

export default async function DashboardLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Leads</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{leads.length} total</span>
          {leads.length > 0 && (
            <a
              href="/api/leads/export"
              download
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent active:translate-y-px"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
