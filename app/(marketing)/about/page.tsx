/**
 * About page — a single full-bleed hero: the agent's headshot covers the whole
 * section while the logo card, name, bio, stats, and CTA float on top in glass
 * cards. No plain content block beneath the image.
 *
 * Every visible value is owner-editable from the dashboard:
 *   - name / brokerage / logo / headshot -> Branding (brand_settings)
 *   - bio + the three stat cards          -> Website Editor (site_settings)
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getSiteSettings, getBrandSettings } from "@/lib/queries";
import type { SiteStat } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description: "Meet your local Los Angeles real estate advisor.",
};

// Glass surface reused by the bio, stat, and CTA cards.
const GLASS =
  "rounded-[22px] border border-white/20 bg-white/[0.12] shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-[18px]";

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
  const area = site?.service_area || "Los Angeles";

  const stats = site?.stats?.length ? site.stats : DEFAULT_STATS;
  const bioParagraphs =
    site?.about_text && site.about_text.trim() !== ""
      ? site.about_text.split(/\n{2,}/).filter(Boolean)
      : DEFAULT_BIO;

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden text-white">
      {/* Full-section background image (the same headshot used on the homepage). */}
      {photo ? (
        // White-label: arbitrary Supabase-hosted URL, so a plain <img> avoids
        // next/image remotePatterns config per buyer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={agentName}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-ink via-ink to-accent-strong" />
      )}

      {/* Dark overlay for readability: a left-to-right wash plus a top-to-bottom one. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.25) 100%), linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 pb-20 pt-36 sm:px-8 lg:pb-24 lg:pt-48">
        {/* Logo card — kept solid so the mark stays crisp over the photo. */}
        <Reveal>
          <div className="inline-flex w-fit items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/30 ring-1 ring-black/5">
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

        {/* Eyebrow + name float directly on the image. */}
        <Reveal delay={0.08}>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Senior Real Estate Advisor · {brokerage}
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
            {agentName}
          </h1>
        </Reveal>

        {/* Bio glass card. */}
        <Reveal delay={0.16}>
          <div className={`${GLASS} mt-9 max-w-[620px] px-8 py-7`}>
            <div className="space-y-4 text-base leading-relaxed text-white/90">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Stat glass cards. */}
        <Stagger className="mt-6 flex flex-wrap gap-4">
          {stats.map((stat, i) => (
            <StaggerItem key={`${stat.label}-${i}`}>
              <div className={`${GLASS} min-w-[150px] px-6 py-5 text-center`}>
                <p className="font-mono text-4xl font-semibold text-white">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-white/75">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA glass card on the same image. */}
        <Reveal delay={0.1}>
          <div
            className={`${GLASS} mt-9 flex flex-col items-start gap-5 px-8 py-7 sm:flex-row sm:items-center sm:justify-between`}
          >
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                Ready to make your move?
              </h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/80">
                Connect with {agentName} for a personal, no-pressure conversation
                about buying or selling in {area}.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90 active:translate-y-px"
            >
              Start a conversation
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
