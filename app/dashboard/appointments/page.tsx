/**
 * Appointments management page. Phase 2 fetches appointments + status updates.
 */
import AppointmentsTable from "@/components/appointments-table";
import { getAppointments } from "@/lib/queries";

export default async function DashboardAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Appointments</h1>
        <span className="text-sm text-muted">{appointments.length} total</span>
      </div>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
