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

const STATUS_LABELS: Record<string, string> = {
  active: "For Sale",
  pending: "Sale Pending",
  sold: "Sold",
  coming_soon: "Coming Soon",
  off_market: "Off Market",
};

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
  const logo = brand?.logo_url || null;
  const agent = brand?.agent_name || "";
  const phone = site?.contact_phone || "";
  const email = site?.contact_email || "";
  const license = brand?.license_number || "";
  const statusLabel = STATUS_LABELS[property.status] ?? property.status;
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

      <article className="overflow-hidden rounded-[1.75rem] border border-line bg-[#fdfbf7] print:rounded-none print:border-0">
        {/* Slim brand bar at the very top */}
        <div className="h-1.5 w-full bg-accent" />

        <div className="p-10 print:p-8">
          {/* Header: logo / wordmark + agent contact */}
          <header className="flex items-center justify-between gap-6">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={company}
                className="h-12 w-auto max-w-[220px] object-contain"
              />
            ) : (
              <p className="font-display text-2xl font-medium tracking-tight text-ink">
                {company}
              </p>
            )}
            <div className="text-right text-xs leading-relaxed text-muted">
              {agent && <p className="text-sm font-medium text-ink">{agent}</p>}
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </div>
          </header>

          {/* Cover image with status overlay */}
          {cover && (
            <div className="relative mt-7 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={property.title}
                className="h-[22rem] w-full object-cover print:h-80"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#fdfbf7]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong shadow-sm">
                {statusLabel}
              </span>
            </div>
          )}

          {/* Title + offered price */}
          <div className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="min-w-0">
              <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4 text-accent" />
                {property.address ? `${property.address}, ` : ""}
                {property.city}, {property.state} {property.zip}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-faint">
                Offered at
              </p>
              <p className="font-display text-3xl font-medium text-accent-strong">
                {currency.format(property.price)}
              </p>
            </div>
          </div>

          {/* Key stats with hairline dividers */}
          <div className="mt-6 flex items-stretch divide-x divide-line border-y border-line">
            <Stat icon={<BedDouble className="h-5 w-5" />} value={String(property.bedrooms)} label="Beds" />
            <Stat icon={<Bath className="h-5 w-5" />} value={String(property.bathrooms)} label="Baths" />
            <Stat icon={<Ruler className="h-5 w-5" />} value={property.square_feet.toLocaleString()} label="Sq ft" />
            {property.lot_size ? (
              <Stat icon={<Ruler className="h-5 w-5" />} value={String(property.lot_size)} label="Acre lot" />
            ) : null}
          </div>

          {/* Description */}
          {property.description && (
            <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted">
              {property.description}
            </p>
          )}

          {/* Extra photos */}
          {extra.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {extra.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-28 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          {/* Features */}
          {property.features.length > 0 && (
            <div className="mt-7">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
                Features
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-ink">
                {property.features.slice(0, 8).map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer: brand + QR (no raw URL) */}
          <footer className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-6">
            <div>
              <p className="font-display text-lg font-medium tracking-tight text-ink">
                {company}
              </p>
              {agent && <p className="text-sm text-muted">{agent}</p>}
              {license && (
                <p className="mt-2 text-xs text-faint">License #{license}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <p className="max-w-[7rem] text-right text-xs leading-snug text-muted">
                Scan for photos, details, and a private tour
              </p>
              <QrCode
                value={listingUrl}
                size={96}
                className="rounded-lg border border-line bg-white p-1"
              />
            </div>
          </footer>
        </div>
      </article>
    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 py-4">
      <span className="text-accent">{icon}</span>
      <span className="font-display text-xl font-medium leading-none text-ink">
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.14em] text-faint">
        {label}
      </span>
    </div>
  );
}
