/**
 * Layout for all public marketing pages: shared header + footer chrome, fed by
 * the editable site_settings / brand_settings. The agent's primary brand color
 * is applied as the accent across the whole public site via a scoped CSS var.
 */
import type { CSSProperties } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { getSiteSettings, getBrandSettings } from "@/lib/queries";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, brand] = await Promise.all([
    getSiteSettings(),
    getBrandSettings(),
  ]);

  const companyName = site?.company_name || brand?.company_name || "PropDrive";
  const accent = brand?.primary_color || "#b85c38";
  const brandStyle = {
    "--color-accent": accent,
    "--color-accent-strong": accent,
  } as CSSProperties;

  return (
    <div style={brandStyle} className="flex min-h-screen flex-col">
      <Nav companyName={companyName} />
      <main className="flex-1">{children}</main>
      <Footer site={site} brand={brand} />
      <ScrollToTop />
    </div>
  );
}
