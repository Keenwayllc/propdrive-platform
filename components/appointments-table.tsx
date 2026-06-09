/**
 * Appointments table for the dashboard. Data fetching is wired in Phase 2.
 */
import type { Appointment } from "@/lib/types";

export interface AppointmentsTableProps {
  appointments?: Appointment[];
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  requested: "bg-amber-100 text-amber-700",
  confirmed: "bg-accent-soft text-accent",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-line text-muted",
  no_show: "bg-red-100 text-red-700",
};

export default function AppointmentsTable({
  appointments = [],
}: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
        No appointments scheduled yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-background text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-background">
              <td className="px-4 py-3 font-medium text-ink">{appt.lead_name}</td>
              <td className="px-4 py-3 text-muted">{appt.property ?? "—"}</td>
              <td className="px-4 py-3 text-muted">
                {appt.appointment_date} · {appt.appointment_time}
              </td>
              <td className="px-4 py-3 capitalize text-muted">
                {appt.appointment_type.replace("_", " ")}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                  {appt.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
