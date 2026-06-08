/**
 * Properties management page. Phase 2 adds create/edit/delete + image uploads.
 */
import { Plus } from "lucide-react";
import PropertiesTable from "@/components/properties-table";

export default function DashboardPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" /> Add listing
        </button>
      </div>
      {/* TODO(phase-2): fetch properties from Supabase and pass to the table. */}
      <PropertiesTable />
    </div>
  );
}
