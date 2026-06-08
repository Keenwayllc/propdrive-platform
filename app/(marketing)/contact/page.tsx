/**
 * Contact page — general enquiry form plus office details.
 */
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with your San Diego real estate advisor.",
};

const CONTACT_DETAILS = [
  { icon: Phone, label: "(619) 555-0148" },
  { icon: Mail, label: "sophia@californiarealtygroup.com" },
  { icon: MapPin, label: "1234 Prospect St, La Jolla, CA 92037" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Get in touch</h1>
        <p className="mt-3 text-slate-600">
          Have a question about buying, selling, or a specific listing? Send a
          message and we&apos;ll get back to you within one business day.
        </p>

        <ul className="mt-8 space-y-4">
          {CONTACT_DETAILS.map((detail) => (
            <li key={detail.label} className="flex items-center gap-3 text-slate-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <detail.icon className="h-5 w-5" />
              </span>
              {detail.label}
            </li>
          ))}
        </ul>
      </div>

      <LeadForm leadType="general" title="Send a message" />
    </div>
  );
}
