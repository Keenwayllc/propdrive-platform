/**
 * Property details page. Dynamic route — `params` is async in this Next version.
 * Fetches the listing from Supabase and renders a gallery, facts, and a showing
 * request sidebar.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler, Check, FileText } from "lucide-react";
import ScheduleShowingForm from "@/components/schedule-showing-form";
import PropertyGallery from "@/components/property-gallery";
import { Reveal } from "@/components/motion";
import { getPropertyById } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
import type { Property } from "@/lib/types";

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

  const description = `${currency.format(property.price)} · ${property.bedrooms} bd · ${property.bathrooms} ba · ${property.square_feet.toLocaleString()} sqft · ${property.city}, ${property.state}`;
  const cover = property.image_urls[0];
  const url = `/properties/${property.id}`;

  return {
    title: property.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: property.title,
      description,
      url,
      type: "website",
      images: cover ? [{ url: cover, alt: property.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

/** schema.org structured data so the listing can show as a rich result. */
function listingJsonLd(property: Property) {
  const availability =
    property.status === "sold"
      ? "https://schema.org/SoldOut"
      : property.status === "pending"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || undefined,
    url: `${SITE_URL}/properties/${property.id}`,
    image: property.image_urls.length ? property.image_urls : undefined,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability,
    },
    about: {
      "@type": "SingleFamilyResidence",
      numberOfBedrooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.square_feet,
        unitCode: "FTK",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address || undefined,
        addressLocality: property.city,
        addressRegion: property.state,
        postalCode: property.zip || undefined,
        addressCountry: "US",
      },
    },
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

  const statusLabel = STATUS_LABELS[property.status] ?? property.status;
  const facts: Array<{ label: string; value: string }> = [
    { label: "Type", value: property.property_type.replace("_", " ") },
    { label: "Status", value: statusLabel },
    { label: "Bedrooms", value: String(property.bedrooms) },
    { label: "Bathrooms", value: String(property.bathrooms) },
    { label: "Interior", value: `${property.square_feet.toLocaleString()} sqft` },
    {
      label: "Lot size",
      value: property.lot_size ? `${property.lot_size} acres` : "—",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape `<` so a field containing "</script>" can't break out.
          __html: JSON.stringify(listingJsonLd(property)).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <Reveal>
        <div className="mt-6">
          <PropertyGallery
            images={property.image_urls}
            title={property.title}
            statusLabel={statusLabel}
          />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.7fr_1fr]">
        {/* Details */}
        <div>
          <p className="font-mono text-3xl font-semibold text-ink sm:text-4xl">
            {currency.format(property.price)}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4 text-accent" />
            {property.address ? `${property.address}, ` : ""}
            {property.city}, {property.state} {property.zip}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-5">
            <Stat icon={<BedDouble className="h-5 w-5" />} value={`${property.bedrooms} beds`} />
            <Stat icon={<Bath className="h-5 w-5" />} value={`${property.bathrooms} baths`} />
            <Stat icon={<Ruler className="h-5 w-5" />} value={`${property.square_feet.toLocaleString()} sqft`} />
          </div>

          <p className="mt-7 max-w-prose text-lg leading-relaxed text-muted">
            {property.description}
          </p>

          {/* Facts */}
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-line pt-3">
                <dt className="text-xs uppercase tracking-[0.12em] text-faint">
                  {f.label}
                </dt>
                <dd className="mt-1 font-medium capitalize text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          {property.features.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                Features
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-muted">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Booking sidebar */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 rounded-[1.5rem] border border-line bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-faint">
                Asking price
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold text-ink">
                {currency.format(property.price)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {property.bedrooms} bd · {property.bathrooms} ba ·{" "}
                {property.square_feet.toLocaleString()} sqft
              </p>
            </div>
            <ScheduleShowingForm propertyLabel={property.map_address || property.title} />
            <Link
              href={`/flyer/${property.id}`}
              target="_blank"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              <FileText className="h-4 w-4" /> Print flyer / QR code
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-2 font-medium text-ink">
      <span className="text-accent">{icon}</span>
      {value}
    </span>
  );
}
