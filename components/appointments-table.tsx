/**
 * Appointments table for the dashboard. Data fetching is wired in Phase 2.
 */
import type { Appointment } from "@/lib/types";
import AppointmentStatusSelect from "@/components/appointment-status-select";

export interface AppointmentsTableProps {
  appointments?: Appointment[];
}

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
                <AppointmentStatusSelect id={appt.id} status={appt.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
