"use client";

/**
 * Lead analytics for the dashboard overview: a "by type" bar chart (where leads
 * come from) and a status pipeline (how they move from new to closed). All
 * computed from real leads in app/dashboard/page.tsx, with an honest empty state.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

export interface Slice {
  label: string;
  count: number;
}

const TYPE_COLORS: Record<string, string> = {
  Buyer: "#006aff",
  Seller: "#0d9488",
  Valuation: "#d97706",
  General: "#94a3b8",
};

const STATUS_COLORS: Record<string, string> = {
  New: "bg-accent-soft text-accent",
  Contacted: "bg-sky-100 text-sky-700",
  Qualified: "bg-teal-100 text-teal-700",
  Closed: "bg-green-100 text-green-700",
  Lost: "bg-line text-muted",
};

export default function LeadsBreakdown({
  byType,
  byStatus,
}: {
  byType: Slice[];
  byStatus: Slice[];
}) {
  const total = byType.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_30px_-22px_rgba(26,23,20,0.4)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Leads by type & status</h3>
        <span className="text-xs text-faint">all time</span>
      </div>

      {total === 0 ? (
        <div className="mt-4 flex h-56 flex-col items-center justify-center text-center">
          <PieIcon className="h-8 w-8 text-faint" />
          <p className="mt-3 text-sm text-muted">No leads to break down yet.</p>
          <p className="mt-1 max-w-xs text-xs text-faint">
            Once enquiries arrive, you will see where they come from and where
            they are in your pipeline.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {/* By type */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byType}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={12}
                  width={70}
                />
                <Tooltip
                  formatter={(value) => [`${value} lead${Number(value) === 1 ? "" : "s"}`, "Leads"]}
                  cursor={{ fill: "#f5f7fb" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {byType.map((d) => (
                    <Cell key={d.label} fill={TYPE_COLORS[d.label] ?? "#006aff"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline by status */}
          <div className="flex flex-col justify-center gap-2.5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
              Pipeline
            </p>
            {byStatus.map((s) => {
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span
                    className={`w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-medium ${
                      STATUS_COLORS[s.label] ?? "bg-line text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-medium text-ink">
                    {s.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
