/**
 * Contact page — general enquiry form plus office details.
 */
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "@/components/lead-form";
import { Reveal } from "@/components/motion";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with your Los Angeles real estate advisor.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const CONTACT_DETAILS = [
    { icon: Phone, label: site?.contact_phone || "(310) 555-0148" },
    { icon: Mail, label: site?.contact_email || "sophia@californiarealtygroup.com" },
    { icon: MapPin, label: site?.office_address || "9601 Wilshire Blvd, Beverly Hills, CA 90210" },
  ].filter((d) => d.label.trim() !== "");

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Let&apos;s talk
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Get in touch.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
          Have a question about buying, selling, or a specific listing? Send a
          message and we&apos;ll get back to you within one business day.
        </p>

        <ul className="mt-10 space-y-4">
          {CONTACT_DETAILS.map((detail) => (
            <li key={detail.label} className="flex items-center gap-3 text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <detail.icon className="h-5 w-5" />
              </span>
              {detail.label}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.12}>
        <LeadForm leadType="general" title="Send a message" />
      </Reveal>
    </div>
  );
}
