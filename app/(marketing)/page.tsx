/**
 * Home page — full-bleed AI-generated hero banner, kinetic neighborhood
 * marquee, animated bento value-props, and a lead-capture close.
 * "Coastal Luxe" system, Los Angeles County market.
 * Content is placeholder; in production it reads from `site_settings`.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, TrendingUp, Sparkles } from "lucide-react";
import LeadForm from "@/components/lead-form";
import PropertyCard from "@/components/property-card";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { getFeaturedProperties, getSiteSettings } from "@/lib/queries";

const NEIGHBORHOODS = [
  "Beverly Hills",
  "Bel Air",
  "Santa Monica",
  "Malibu",
  "Westwood",
  "Pacific Palisades",
  "Calabasas",
  "Brentwood",
  "Encino",
  "Sherman Oaks",
];

const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "127", label: "Homes closed" },
  { value: "11", label: "Avg. days on market" },
  { value: "98.2%", label: "Of list price" },
];

export default async function HomePage() {
  const [featured, site] = await Promise.all([
    getFeaturedProperties(3),
    getSiteSettings(),
  ]);
  const heroTitle = site?.hero_title || "Find the home that feels like arrival.";
  const heroSubtitle =
    site?.hero_subtitle ||
    "Hand-picked listings and local guidance from an advisor who knows every street from the Palisades to the Valley.";

  return (
    <>
      {/* ----------------------------------------------------- Hero banner */}
      <section className="relative isolate overflow-hidden">
        {/* Generated banner + warm legibility gradients */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero/hero-banner.png"
            alt="Modern luxury estate overlooking Los Angeles at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        <div className="mx-auto flex min-h-[88svh] max-w-7xl items-center px-4 sm:px-6">
          <div className="max-w-xl py-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Los Angeles County, California
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-5xl font-medium leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.75rem]">
                {heroTitle}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {heroSubtitle}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.4}>
                  <Link
                    href="/properties"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
                  >
                    Browse listings
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Link
                  href="/home-valuation"
                  className="inline-flex items-center rounded-full border border-line bg-surface/70 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-surface active:translate-y-px"
                >
                  What&apos;s my home worth?
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line/80 pt-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-2xl font-semibold text-ink">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-xs leading-snug text-muted">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Floating listing badge over the architecture (large screens) */}
        <div className="pd-float absolute bottom-10 right-8 hidden rounded-2xl border border-line bg-surface/90 p-4 shadow-[0_20px_40px_-20px_rgba(26,23,20,0.45)] backdrop-blur xl:block">
          <p className="text-xs font-medium text-faint">Featured · Beverly Hills</p>
          <p className="mt-0.5 font-mono text-lg font-semibold text-ink">
            $6,450,000
          </p>
          <p className="text-xs text-muted">5 bd · 6 ba · canyon view</p>
        </div>
      </section>

      {/* Kinetic neighborhood marquee */}
      <div className="border-y border-line bg-surface/60 py-4">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="pd-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...NEIGHBORHOODS, ...NEIGHBORHOODS].map((n, i) => (
              <span
                key={`${n}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap font-display text-xl italic text-faint"
              >
                {n}
                <span className="h-1 w-1 rounded-full bg-accent/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- Value bento */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Why work with us
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            A calmer way to buy and sell.
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[230px]">
          {/* Large feature tile — reuses the second generated estate render */}
          <StaggerItem className="sm:col-span-2 lg:row-span-2">
            <div className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line bg-ink p-8 text-background">
              <Image
                src="/hero/hero-glow.png"
                alt="Modern Los Angeles hillside estate with infinity pool at golden hour"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="relative">
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Listings worth the drive
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                  Every home is vetted in person, photographed properly, and
                  priced with real comps — no surprises at the showing.
                </p>
                <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white"
                >
                  See the collection
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <BentoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Block-by-block local"
              text="Twelve years from the Westside to Calabasas. Ask about any street."
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
              imageAlt="Los Angeles streets and skyline"
            />
          </StaggerItem>

          <StaggerItem>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-line bg-accent-soft p-7">
              <svg
                aria-hidden="true"
                viewBox="0 0 120 60"
                className="pointer-events-none absolute right-4 top-4 h-16 w-28 text-accent/30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 52 L26 40 L48 46 L72 22 L96 28 L118 6" />
              </svg>
              <span className="relative text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
                On market
              </span>
              <div className="relative">
                <p className="font-mono text-4xl font-semibold text-ink">11</p>
                <p className="mt-1 text-sm text-muted">
                  median days before an offer
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <BentoCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Priced on real data"
              text="98.2% of list price, on average — not guesswork."
              image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
              imageAlt="Bright modern living room interior"
            />
          </StaggerItem>

          <StaggerItem>
            <BentoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Smart, not pushy"
              text="Useful updates when they matter. Silence when they don't."
              image="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
              imageAlt="Calm, elegant living space"
            />
          </StaggerItem>
        </Stagger>
      </section>

      {/* ----------------------------------------------------- Featured listings */}
      {featured.length > 0 && (
        <section className="border-t border-line bg-surface/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Featured
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                    This week&apos;s standouts
                  </h2>
                </div>
                <Link
                  href="/properties"
                  className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:underline sm:inline-flex"
                >
                  View all listings
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <StaggerItem key={property.id}>
                  <PropertyCard property={property} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- Lead capture */}
      <section className="border-t border-line bg-surface/50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Let&apos;s talk
            </p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Tell us what you&apos;re looking for.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Share a few details and Sophia will follow up with homes that
              actually fit — no spam, no obligation.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              {[
                "A short call to understand your search",
                "A tailored shortlist within 48 hours",
                "Private showings on your schedule",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <LeadForm leadType="buyer" title="Get in touch" />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * Bento tile for the value section. With `image`, renders a rich photo-backed
 * tile (ink wash + white text); otherwise a clean light card.
 */
function BentoCard({
  icon,
  title,
  text,
  image,
  imageAlt,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
}) {
  if (image) {
    return (
      <div className="group relative flex h-full min-h-[230px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line bg-ink p-7 text-background">
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          sizes="(max-width: 1024px) 50vw, 30vw"
          className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-sm">
            {icon}
          </span>
          <h3 className="font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/75">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-line bg-surface p-7 transition-colors hover:border-accent/40">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}
