/**
 * Dashboard overview — summary stats, quick actions, and a recent-leads feed.
 */
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  Building2,
  TrendingUp,
  Inbox,
  Plus,
  Pencil,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DashboardCard from "@/components/dashboard-card";
import { getDashboardStats, getLeads } from "@/lib/queries";

const TYPE_STYLES: Record<string, string> = {
  buyer: "bg-accent-soft text-accent",
  seller: "bg-teal-100 text-teal-700",
  valuation: "bg-amber-100 text-amber-700",
  general: "bg-line text-muted",
};

const QUICK_ACTIONS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard/properties/new", label: "Add Property", icon: Plus },
  { href: "/dashboard/leads", label: "View Leads", icon: Users },
  { href: "/dashboard/website-editor", label: "Edit Website", icon: Pencil },
  { href: "/dashboard/branding", label: "Update Branding", icon: Palette },
];

export default async function DashboardOverviewPage() {
  const [stats, leads] = await Promise.all([getDashboardStats(), getLeads()]);
  const recent = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Total leads" value={leads.length} icon={TrendingUp} />
        <DashboardCard label="Active listings" value={stats.activeListings} icon={Building2} />
        <DashboardCard
          label="Upcoming appointments"
          value={stats.upcomingAppointments}
          icon={CalendarCheck}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-faint">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_30px_-22px_rgba(26,23,20,0.4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Recent leads</h3>
          <Link href="/dashboard/leads" className="text-xs font-medium text-accent hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-6 flex flex-col items-center py-8 text-center">
            <Inbox className="h-8 w-8 text-faint" />
            <p className="mt-3 text-sm text-muted">
              No leads yet. New enquiries from your site land here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {recent.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{lead.full_name}</p>
                  <p className="truncate text-xs text-muted">{lead.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      TYPE_STYLES[lead.lead_type] ?? TYPE_STYLES.general
                    }`}
                  >
                    {lead.lead_type}
                  </span>
                  <span className="text-xs text-faint">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
