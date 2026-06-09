/**
 * New property listing.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyForm from "@/components/property-form";

export default function NewPropertyPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/dashboard/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Properties
      </Link>
      <h1 className="text-2xl font-bold text-ink">Add a listing</h1>
      <PropertyForm />
    </div>
  );
}
