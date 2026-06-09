/**
 * Appointments management page. Phase 2 fetches appointments + status updates.
 */
import AppointmentsTable from "@/components/appointments-table";

export default function DashboardAppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">Appointments</h1>
      {/* TODO(phase-2): fetch appointments from Supabase and pass to the table. */}
      <AppointmentsTable />
    </div>
  );
}
