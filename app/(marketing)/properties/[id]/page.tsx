/**
 * Property details page. Dynamic route — `params` is async in this Next version.
 * Phase 1 renders a scaffold using the id; Phase 2 fetches the real listing.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScheduleShowingForm from "@/components/schedule-showing-form";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO(phase-2): fetch the property by id and render gallery, specs, map.

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/properties"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
            Property gallery (id: {id})
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Listing details
          </h1>
          <p className="mt-2 text-slate-500">
            Full description, features, specifications, and map will render here
            once connected to the database.
          </p>
        </div>

        <aside className="lg:col-span-1">
          <ScheduleShowingForm />
        </aside>
      </div>
    </div>
  );
}
