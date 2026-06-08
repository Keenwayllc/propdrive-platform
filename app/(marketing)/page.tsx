/**
 * Home page — hero, value props, featured listings, and a lead CTA.
 * Content is placeholder; in production it reads from `site_settings`.
 */
import Link from "next/link";
import { Building2, LineChart, Users } from "lucide-react";
import LeadForm from "@/components/lead-form";

const VALUE_PROPS = [
  {
    icon: Building2,
    title: "Curated Listings",
    text: "Browse handpicked homes across San Diego with rich photos and details.",
  },
  {
    icon: Users,
    title: "Local Expertise",
    text: "Work with an advisor who knows every neighborhood inside and out.",
  },
  {
    icon: LineChart,
    title: "Data-Driven Pricing",
    text: "Get an accurate home valuation backed by real market data.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Find Your Next Home in San Diego
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Expert guidance for buyers and sellers across San Diego County.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/properties"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Browse Listings
            </Link>
            <Link
              href="/home-valuation"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get a Home Valuation
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((vp) => (
            <div key={vp.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <vp.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{vp.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{vp.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead capture */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Let&apos;s find your perfect home
            </h2>
            <p className="mt-3 text-slate-600">
              Tell us what you&apos;re looking for and a local advisor will reach
              out with tailored recommendations — no obligation.
            </p>
          </div>
          <LeadForm leadType="buyer" title="Get in touch" />
        </div>
      </section>
    </>
  );
}
