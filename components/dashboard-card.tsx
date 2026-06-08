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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      {trend && (
        <p
          className={`mt-1 text-sm font-medium ${
            trendPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
