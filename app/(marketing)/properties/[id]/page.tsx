/**
 * Property details page. Dynamic route — `params` is async in this Next version.
 * Phase 1 renders a scaffold using the id; Phase 2 fetches the real listing.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScheduleShowingForm from "@/components/schedule-showing-form";
import { Reveal } from "@/components/motion";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO(phase-2): fetch the property by id and render gallery, specs, map.

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[1.75rem] border border-line bg-surface text-faint">
            Property gallery (id: {id})
          </div>
          <h1 className="mt-8 font-display text-4xl font-medium tracking-tight text-ink">
            Listing details
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
            Full description, features, specifications, and map will render here
            once connected to the database.
          </p>
        </Reveal>

        <aside className="lg:col-span-1">
          <ScheduleShowingForm />
        </aside>
      </div>
    </div>
  );
}
