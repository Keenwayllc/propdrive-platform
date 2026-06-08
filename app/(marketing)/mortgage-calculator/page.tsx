/**
 * Mortgage calculator page.
 */
import type { Metadata } from "next";
import MortgageCalculator from "@/components/mortgage-calculator";

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description: "Estimate your monthly mortgage payment.",
};

export default function MortgageCalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Mortgage Calculator</h1>
        <p className="mt-2 text-slate-500">
          Estimate your monthly payment including taxes and insurance.
        </p>
      </header>
      <MortgageCalculator />
    </div>
  );
}
