"use client";

/**
 * "Leads over time" — real monthly lead counts for the dashboard overview.
 * Data is computed from actual leads (see app/dashboard/page.tsx); when there
 * is no activity yet it shows an honest empty state rather than sample data.
 */
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

export interface ChartPoint {
  month: string;
  leads: number;
}

export default function LeadsChart({
  data,
  title = "Leads over time",
}: {
  data: ChartPoint[];
  title?: string;
}) {
  const total = data.reduce((sum, d) => sum + d.leads, 0);
  const maxLeads = Math.max(0, ...data.map((d) => d.leads));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_30px_-22px_rgba(26,23,20,0.4)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className="text-xs text-faint">last 6 months</span>
      </div>

      {total === 0 ? (
        <div className="mt-4 flex h-64 flex-col items-center justify-center text-center">
          <LineChartIcon className="h-8 w-8 text-faint" />
          <p className="mt-3 text-sm text-muted">No lead activity yet.</p>
          <p className="mt-1 max-w-xs text-xs text-faint">
            As enquiries come in from your site, your monthly trend will appear
            here.
          </p>
        </div>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b85c38" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#b85c38" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                allowDecimals={false}
                domain={[0, Math.max(4, maxLeads)]}
              />
              <Tooltip
                formatter={(value) => [`${value} lead${Number(value) === 1 ? "" : "s"}`, "Leads"]}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#b85c38"
                strokeWidth={2}
                fill="url(#leadsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
