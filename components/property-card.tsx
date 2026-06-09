/**
 * Compact property listing card used on listing grids and the home page.
 */
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const STATUS_LABELS: Record<Property["status"], string> = {
  active: "For Sale",
  pending: "Pending",
  sold: "Sold",
  coming_soon: "Coming Soon",
  off_market: "Off Market",
};

export interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cover = property.image_urls[0] ?? PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_18px_40px_-28px_rgba(26,23,20,0.35)] transition-all hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {STATUS_LABELS[property.status]}
        </span>
        {property.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="font-mono text-lg font-semibold text-ink">
          {currency.format(property.price)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-medium text-ink">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="line-clamp-1">
            {property.address}, {property.city}
          </span>
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-line pt-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {property.bathrooms} ba
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> {property.square_feet.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
