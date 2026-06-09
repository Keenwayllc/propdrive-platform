/**
 * Edit an existing property listing.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PropertyForm from "@/components/property-form";
import { getPropertyById } from "@/lib/queries";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/dashboard/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Properties
      </Link>
      <h1 className="text-2xl font-bold text-ink">Edit listing</h1>
      <PropertyForm property={property} />
    </div>
  );
}
