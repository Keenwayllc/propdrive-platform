/**
 * Appointments table for the dashboard. Data fetching is wired in Phase 2.
 */
import type { Appointment } from "@/lib/types";

export interface AppointmentsTableProps {
  appointments?: Appointment[];
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  requested: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
  no_show: "bg-red-100 text-red-700",
};

export default function AppointmentsTable({
  appointments = [],
}: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No appointments scheduled yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{appt.lead_name}</td>
              <td className="px-4 py-3 text-slate-600">{appt.property ?? "—"}</td>
              <td className="px-4 py-3 text-slate-600">
                {appt.appointment_date} · {appt.appointment_time}
              </td>
              <td className="px-4 py-3 capitalize text-slate-600">
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
