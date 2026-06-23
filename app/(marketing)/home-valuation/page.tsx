/**
 * Home valuation landing page — seller lead capture.
 */
import type { Metadata } from "next";
import HomeValuationForm from "@/components/home-valuation-form";
import { Reveal } from "@/components/motion";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Home Valuation",
  description: "Find out what your Los Angeles home is worth — free, no obligation.",
};

export default async function HomeValuationPage() {
  const settings = await getSiteSettings();
  const eyebrow = settings?.valuation_eyebrow?.trim() || "Sellers";
  const title = settings?.valuation_title?.trim() || "What's your home worth?";
  const subtitle =
    settings?.valuation_subtitle?.trim() ||
    "Get a free, personalized valuation based on recent sales and current market conditions in your LA neighborhood.";

  return (
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
          {subtitle}
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          {[
            "Accurate, data-driven estimate",
            "Prepared by a local advisor",
            "No cost and no obligation",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.12}>
        <HomeValuationForm />
      </Reveal>
    </div>
  );
}
