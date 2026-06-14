"use client";

/**
 * Mortgage calculator — pure client-side estimate of the monthly payment
 * (principal & interest + taxes + insurance). No persistence.
 */
import { useMemo, useState } from "react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface CalcState {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  termYears: number;
  taxRate: number;
  insurance: number;
}

const INITIAL: CalcState = {
  homePrice: 750000,
  downPayment: 150000,
  interestRate: 6.5,
  termYears: 30,
  taxRate: 1.1,
  insurance: 1500,
};

export default function MortgageCalculator() {
  const [state, setState] = useState<CalcState>(INITIAL);

  const monthly = useMemo(() => {
    const principal = Math.max(state.homePrice - state.downPayment, 0);
    const monthlyRate = state.interestRate / 100 / 12;
    const payments = state.termYears * 12;

    const principalAndInterest =
      monthlyRate === 0
        ? principal / payments
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
          (Math.pow(1 + monthlyRate, payments) - 1);

    const monthlyTax = (state.homePrice * (state.taxRate / 100)) / 12;
    const monthlyInsurance = state.insurance / 12;

    return {
      principalAndInterest,
      monthlyTax,
      monthlyInsurance,
      total: principalAndInterest + monthlyTax + monthlyInsurance,
    };
  }, [state]);

  function set<K extends keyof CalcState>(key: K, value: number) {
    // Clamp to sane bounds so negative / empty / zero inputs can't produce
    // NaN or Infinity in the payment math (e.g. a 0-year term).
    const v = Number.isFinite(value) ? Math.max(value, 0) : 0;
    const clamped = key === "termYears" ? Math.max(Math.round(v), 1) : v;
    setState((prev) => ({ ...prev, [key]: clamped }));
  }

  return (
    <div className="grid gap-6 rounded-xl border border-line bg-white p-6 shadow-sm lg:grid-cols-2">
      <div className="space-y-4">
        <NumberField label="Home price" value={state.homePrice} onChange={(v) => set("homePrice", v)} prefix="$" />
        <NumberField label="Down payment" value={state.downPayment} onChange={(v) => set("downPayment", v)} prefix="$" />
        <NumberField label="Interest rate" value={state.interestRate} onChange={(v) => set("interestRate", v)} suffix="%" step={0.1} />
        <NumberField label="Loan term (years)" value={state.termYears} onChange={(v) => set("termYears", v)} />
        <NumberField label="Property tax rate" value={state.taxRate} onChange={(v) => set("taxRate", v)} suffix="%" step={0.1} />
        <NumberField label="Annual insurance" value={state.insurance} onChange={(v) => set("insurance", v)} prefix="$" />
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-background p-6">
        <p className="text-sm font-medium text-muted">Estimated monthly payment</p>
        <p className="mt-1 text-4xl font-bold text-accent">
          {currency.format(monthly.total)}
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          <Row label="Principal &amp; interest" value={currency.format(monthly.principalAndInterest)} />
          <Row label="Property tax" value={currency.format(monthly.monthlyTax)} />
          <Row label="Home insurance" value={currency.format(monthly.monthlyInsurance)} />
        </dl>
        <p className="mt-4 text-xs text-faint">
          Estimates only. Excludes HOA, PMI, and closing costs. Not a loan offer.
        </p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center rounded-lg border border-line focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30">
        {prefix && <span className="pl-3 text-faint">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
        />
        {suffix && <span className="pr-3 text-faint">{suffix}</span>}
      </div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
