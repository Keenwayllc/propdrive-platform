/**
 * Dashboard overview — summary stats and an example analytics chart.
 * Phase 1 uses placeholder figures; Phase 2 wires real aggregates.
 */
import { Users, CalendarCheck, Building2, TrendingUp } from "lucide-react";
import DashboardCard from "@/components/dashboard-card";
import ChartExample from "@/components/chart-example";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="New leads" value={0} icon={Users} trend="+0 this week" />
        <DashboardCard label="Appointments" value={0} icon={CalendarCheck} trend="0 upcoming" />
        <DashboardCard label="Active listings" value={0} icon={Building2} />
        <DashboardCard label="Conversion" value="0%" icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartExample />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">Recent activity</h3>
          <p className="mt-4 text-sm text-slate-400">
            Activity will appear here once your site starts capturing leads.
          </p>
        </div>
      </div>
    </div>
  );
}
