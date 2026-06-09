/**
 * Branding editor — colors, logo, and agent identity (brand_settings).
 */
import BrandingForm from "@/components/branding-form";
import { getBrandSettings } from "@/lib/queries";

export default async function BrandingPage() {
  const brand = await getBrandSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Branding</h1>
        <p className="mt-1 text-sm text-muted">
          Customize colors and assets to match your brokerage&apos;s identity.
        </p>
      </div>
      <BrandingForm initial={brand} />
    </div>
  );
}
