/**
 * Property details page. Dynamic route — `params` is async in this Next version.
 * Fetches the listing from Supabase and renders gallery, specs, and a showing form.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler, Check } from "lucide-react";
import ScheduleShowingForm from "@/components/schedule-showing-form";
import { Reveal } from "@/components/motion";
import { getPropertyById } from "@/lib/queries";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const STATUS_LABELS: Record<string, string> = {
  active: "For Sale",
  pending: "Pending",
  sold: "Sold",
  coming_soon: "Coming Soon",
  off_market: "Off Market",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return { title: "Listing not found" };
  return {
    title: property.title,
    description: `${property.bedrooms} bd · ${property.bathrooms} ba · ${property.city}, ${property.state}`,
  };
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const [cover, ...rest] = property.image_urls;

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
          {/* Gallery */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border border-line bg-line">
            {cover ? (
              <Image
                src={cover}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-faint">
                No photos yet
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
              {STATUS_LABELS[property.status] ?? property.status}
            </span>
          </div>
          {rest.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {rest.slice(0, 3).map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-line"
                >
                  <Image
                    src={url}
                    alt={`${property.title} photo ${i + 2}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 22vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Header + specs */}
          <div className="mt-8">
            <p className="font-mono text-3xl font-semibold text-ink">
              {currency.format(property.price)}
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted">
              <MapPin className="h-4 w-4 text-accent" />
              {property.address}, {property.city}, {property.state} {property.zip}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 border-y border-line py-5 text-ink">
              <Spec icon={<BedDouble className="h-5 w-5" />} label={`${property.bedrooms} beds`} />
              <Spec icon={<Bath className="h-5 w-5" />} label={`${property.bathrooms} baths`} />
              <Spec icon={<Ruler className="h-5 w-5" />} label={`${property.square_feet.toLocaleString()} sqft`} />
            </div>

            <p className="mt-6 text-lg leading-relaxed text-muted">
              {property.description}
            </p>

            {property.features.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                  Features
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted">
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <ScheduleShowingForm propertyLabel={property.map_address || property.title} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 font-medium">
      <span className="text-accent">{icon}</span>
      {label}
    </span>
  );
}
