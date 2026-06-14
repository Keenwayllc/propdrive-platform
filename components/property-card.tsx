/**
 * Luxe property listing card — large cover photo with an overlaid price chip and
 * status badges, refined spec row, and a smooth hover lift + zoom.
 */
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler, ArrowUpRight } from "lucide-react";
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
      className="group block overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_18px_44px_-30px_rgba(26,23,20,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_60px_-30px_rgba(26,23,20,0.45)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
            {STATUS_LABELS[property.status] ?? property.status}
          </span>
          {property.featured && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>

        {/* Price chip + hover affordance over the photo */}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <p className="font-mono text-2xl font-semibold text-white drop-shadow-sm">
            {currency.format(property.price)}
          </p>
          <span className="flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 font-medium tracking-tight text-ink">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="line-clamp-1">
            {property.address ? `${property.address}, ` : ""}
            {property.city}
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
