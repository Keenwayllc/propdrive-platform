/**
 * Printable, single-page property flyer. Standalone (no site nav/footer) so it
 * prints clean and can be saved as a PDF. Includes a scan-to-view QR code and
 * the agent's branding and contact details. Realtors use this for open houses,
 * yard-sign riders, and handouts.
 */
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin, Ruler, Check } from "lucide-react";
import QrCode from "@/components/qr-code";
import PrintButton from "@/components/print-button";
import { getPropertyById, getSiteSettings, getBrandSettings } from "@/lib/queries";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function PropertyFlyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, site, brand] = await Promise.all([
    getPropertyById(id),
    getSiteSettings(),
    getBrandSettings(),
  ]);
  if (!property) notFound();

  // Absolute URL to the public listing for the QR code (works on any domain).
  const h = await headers();
  const host = h.get("host") ?? "getpropdrive.com";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const listingUrl = `${proto}://${host}/properties/${property.id}`;

  const company = brand?.company_name || site?.company_name || "PropDrive";
  const agent = brand?.agent_name || "";
  const phone = site?.contact_phone || "";
  const email = site?.contact_email || "";
  const license = brand?.license_number || "";
  const cover = property.image_urls[0];
  const extra = property.image_urls.slice(1, 4);

  return (
    <main className="mx-auto max-w-3xl bg-white p-8 text-ink print:p-0">
      {/* Toolbar — hidden when printing */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-sm text-muted">
          Tip: use your browser&apos;s print dialog to save this as a PDF.
        </p>
        <PrintButton />
      </div>

      <article className="rounded-2xl border border-line p-8 print:rounded-none print:border-0 print:p-0">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-xl font-semibold tracking-tight">{company}</p>
            {agent && <p className="text-sm text-muted">{agent}</p>}
          </div>
          <div className="text-right text-sm text-muted">
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
          </div>
        </header>

        {/* Cover image */}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="mt-6 h-80 w-full rounded-xl object-cover print:h-72"
          />
        )}

        {/* Title + price */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight">
              {property.title}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-muted">
              <MapPin className="h-4 w-4 text-accent" />
              {property.address ? `${property.address}, ` : ""}
              {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <p className="font-mono text-3xl font-semibold">
            {currency.format(property.price)}
          </p>
        </div>

        {/* Key stats */}
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4">
          <Stat icon={<BedDouble className="h-5 w-5" />} value={`${property.bedrooms} beds`} />
          <Stat icon={<Bath className="h-5 w-5" />} value={`${property.bathrooms} baths`} />
          <Stat icon={<Ruler className="h-5 w-5" />} value={`${property.square_feet.toLocaleString()} sqft`} />
          {property.lot_size ? (
            <Stat icon={<Ruler className="h-5 w-5" />} value={`${property.lot_size} acre lot`} />
          ) : null}
        </div>

        {/* Description */}
        {property.description && (
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {property.description}
          </p>
        )}

        {/* Extra photos */}
        {extra.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {extra.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="h-28 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* Features */}
        {property.features.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-faint">
              Features
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
              {property.features.slice(0, 8).map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer: QR + license */}
        <footer className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
          <div className="text-xs text-muted">
            <p className="font-medium text-ink">Scan to view this listing</p>
            <p className="mt-1">{listingUrl}</p>
            {license && <p className="mt-2">License #{license}</p>}
          </div>
          <QrCode value={listingUrl} size={104} className="rounded-md" />
        </footer>
      </article>
    </main>
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
