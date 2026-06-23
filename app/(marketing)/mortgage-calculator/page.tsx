/**
 * Mortgage calculator page.
 */
import type { Metadata } from "next";
import MortgageCalculator from "@/components/mortgage-calculator";
import { Reveal } from "@/components/motion";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description: "Estimate your monthly mortgage payment.",
};

export default async function MortgageCalculatorPage() {
  const settings = await getSiteSettings();
  const eyebrow = settings?.mortgage_eyebrow?.trim() || "Buyers";
  const title = settings?.mortgage_title?.trim() || "Mortgage calculator";
  const subtitle =
    settings?.mortgage_subtitle?.trim() ||
    "Estimate your monthly payment including taxes and insurance.";

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <header className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {subtitle}
          </p>
        </header>
      </Reveal>
      <Reveal delay={0.1}>
        <MortgageCalculator />
      </Reveal>
    </div>
  );
}
