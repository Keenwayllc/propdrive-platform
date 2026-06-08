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
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
          {STATUS_LABELS[property.status]}
        </span>
        {property.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-slate-900">
          {currency.format(property.price)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-medium text-slate-800">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {property.address}, {property.city}
          </span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.bathrooms} ba
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" /> {property.square_feet.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
