"use client";

/**
 * Example analytics chart (recharts) for the dashboard overview.
 * Phase 1 uses static sample data; swap in real metrics in Phase 2.
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

export interface ChartPoint {
  month: string;
  leads: number;
}

const SAMPLE_DATA: ChartPoint[] = [
  { month: "Jan", leads: 12 },
  { month: "Feb", leads: 19 },
  { month: "Mar", leads: 15 },
  { month: "Apr", leads: 27 },
  { month: "May", leads: 34 },
  { month: "Jun", leads: 29 },
];

export interface ChartExampleProps {
  data?: ChartPoint[];
  title?: string;
}

export default function ChartExample({
  data = SAMPLE_DATA,
  title = "Leads over time",
}: ChartExampleProps) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
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
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip />
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
    </div>
  );
}
