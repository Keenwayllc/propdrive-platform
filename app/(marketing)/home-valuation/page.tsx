/**
 * Home valuation landing page — seller lead capture.
 */
import type { Metadata } from "next";
import HomeValuationForm from "@/components/home-valuation-form";

export const metadata: Metadata = {
  title: "Home Valuation",
  description: "Find out what your San Diego home is worth — free, no obligation.",
};

export default function HomeValuationPage() {
  return (
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          What&apos;s your home worth?
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Get a free, personalized valuation based on recent sales and current
          market conditions in your neighborhood.
        </p>
        <ul className="mt-6 space-y-2 text-slate-600">
          <li>• Accurate, data-driven estimate</li>
          <li>• Prepared by a local advisor</li>
          <li>• No cost and no obligation</li>
        </ul>
      </div>
      <HomeValuationForm />
    </div>
  );
}
