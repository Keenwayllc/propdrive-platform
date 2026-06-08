/**
 * About page — agent bio and brokerage info. Placeholder copy for Phase 1.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet your local real estate advisor.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-slate-900">About Sophia Carter</h1>
      <p className="mt-2 font-medium text-blue-700">
        Senior Real Estate Advisor · California Realty Group
      </p>

      <div className="prose mt-8 max-w-none text-slate-600">
        <p>
          With deep roots in San Diego County, Sophia helps buyers and sellers
          navigate every step of their real estate journey. This is placeholder
          biography copy that the agent can edit from the dashboard website editor.
        </p>
        <p>
          From first-time buyers in North Park to luxury sellers in La Jolla,
          Sophia brings local market expertise, sharp negotiation, and
          white-glove service to every transaction.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Homes sold", value: "120+" },
          { label: "Years experience", value: "12" },
          { label: "Client rating", value: "5.0★" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
