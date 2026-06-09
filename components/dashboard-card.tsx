/**
 * Stat / summary card for the dashboard overview.
 */
import type { LucideIcon } from "lucide-react";

export interface DashboardCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Optional trend string e.g. "+12% this month". */
  trend?: string;
  trendPositive?: boolean;
}

export default function DashboardCard({
  label,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_30px_-22px_rgba(26,23,20,0.4)] transition-shadow hover:shadow-[0_20px_44px_-26px_rgba(26,23,20,0.45)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {trend && (
        <p
          className={`mt-1 text-sm font-medium ${
            trendPositive ? "text-green-600" : "text-muted"
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
