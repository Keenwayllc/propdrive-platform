/**
 * About page — agent bio and brokerage info. Placeholder copy for Phase 1.
 */
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getSiteSettings, getBrandSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About",
  description: "Meet your local Los Angeles real estate advisor.",
};

const STATS = [
  { label: "Homes closed", value: "127" },
  { label: "Years in LA", value: "12" },
  { label: "Client rating", value: "4.97" },
];

const DEFAULT_BIO = [
  "With deep roots across Los Angeles, Marcus helps buyers and sellers navigate every step of their move. This is placeholder biography copy that the agent edits from the dashboard website editor.",
  "From first-time buyers in Westwood to luxury sellers in Beverly Hills and Malibu, Marcus brings local market expertise, sharp negotiation, and white-glove service to every transaction.",
];

export default async function AboutPage() {
  const [site, brand] = await Promise.all([
    getSiteSettings(),
    getBrandSettings(),
  ]);

  const agentName = brand?.agent_name || "Marcus Rivera";
  const brokerage =
    brand?.brokerage_name || site?.company_name || "California Realty Group";
  const bioParagraphs =
    site?.about_text && site.about_text.trim() !== ""
      ? site.about_text.split(/\n{2,}/).filter(Boolean)
      : DEFAULT_BIO;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Senior Real Estate Advisor · {brokerage}
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
          {agentName}
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {bioParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </Reveal>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="rounded-[1.5rem] border border-line bg-surface p-7 text-center">
              <p className="font-mono text-4xl font-semibold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
