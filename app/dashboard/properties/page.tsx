/**
 * Properties management page. Full create/edit/delete with image uploads.
 */
import Link from "next/link";
import { Plus } from "lucide-react";
import PropertiesTable from "@/components/properties-table";
import { getAllProperties } from "@/lib/queries";

export default async function DashboardPropertiesPage() {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Properties</h1>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> Add listing
        </Link>
      </div>
      <PropertiesTable properties={properties} />
    </div>
  );
}
