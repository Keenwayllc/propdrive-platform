/**
 * About page — agent bio, brokerage info, and credibility stats.
 *
 * Every visible value is owner-editable from the dashboard:
 *   - name / brokerage / logo / headshot -> Branding (brand_settings)
 *   - bio + the three stat cards          -> Website Editor (site_settings)
 * The hero uses the agent's uploaded headshot (`brand.agent_photo_url`, the same
 * image shown in the homepage agent section) as a zoomed, overlaid backdrop with
 * the brand logo in a white badge. Everything degrades gracefully when a buyer
 * hasn't uploaded a photo/logo or customised the stats yet.
 */
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getSiteSettings, getBrandSettings } from "@/lib/queries";
import type { SiteStat } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description: "Meet your local Los Angeles real estate advisor.",
};

// Fallbacks only — overridden by the owner's site_settings.stats (Website Editor).
const DEFAULT_STATS: SiteStat[] = [
  { value: 127, suffix: "", label: "Homes closed" },
  { value: 12, suffix: "", label: "Years in LA" },
  { value: 4.97, suffix: "", label: "Client rating" },
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
  const companyName = site?.company_name || brand?.company_name || "PropDrive";
  const photo = brand?.agent_photo_url || brand?.hero_image_url || null;
  const logoUrl = brand?.logo_url || null;
  const initial = companyName.trim().charAt(0).toUpperCase() || "P";

  const stats = site?.stats?.length ? site.stats : DEFAULT_STATS;
  const bioParagraphs =
    site?.about_text && site.about_text.trim() !== ""
      ? site.about_text.split(/\n{2,}/).filter(Boolean)
      : DEFAULT_BIO;

  return (
    <div>
      {/* Hero: agent headshot as a zoomed, overlaid backdrop. */}
      <section className="relative isolate flex min-h-[66vh] flex-col justify-end overflow-hidden lg:min-h-[72vh]">
        {photo ? (
          // White-label: arbitrary Supabase-hosted URL, so a plain <img> avoids
          // next/image remotePatterns config per buyer. Zoomed + biased upward
          // so the subject's face stays in frame behind the text.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={agentName}
            className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover object-[50%_22%]"
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink via-ink to-accent-strong" />
        )}

        {/* Legibility wash: dark at the bottom-left where the text lives. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/15"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 to-transparent"
        />

        <div className="mx-auto w-full max-w-5xl px-4 pb-14 pt-32 sm:px-6 lg:pb-20">
          <Reveal>
            <div className="inline-flex w-fit items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/25 ring-1 ring-black/5">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-8 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-base leading-none text-white">
                    {initial}
                  </span>
                  <span className="text-base font-semibold tracking-tight text-ink">
                    {companyName}
                  </span>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Senior Real Estate Advisor · {brokerage}
            </p>
            <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
              {agentName}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Bio + stats on the light surface. */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {bioParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <StaggerItem key={`${stat.label}-${i}`}>
              <div className="rounded-[1.5rem] border border-line bg-surface p-7 text-center">
                <p className="font-mono text-4xl font-semibold text-ink">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
