"use client";

/**
 * Mortgage calculator — pure client-side estimate of the monthly payment
 * (principal & interest + taxes + insurance). The math never touches the server;
 * only the optional "talk to an agent" lead capture does.
 */
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mortgageLeadSchema, type MortgageLeadValues } from "@/lib/form-schemas";
import { submitMortgageLead } from "@/lib/actions";

/** Contact fields only — the numeric estimate is supplied by the calculator. */
type ContactValues = Pick<MortgageLeadValues, "full_name" | "email" | "phone">;
const contactSchema = mortgageLeadSchema.pick({
  full_name: true,
  email: true,
  phone: true,
});

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
    <div className="space-y-6">
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

      <EstimateLeadForm
        homePrice={state.homePrice}
        downPayment={state.downPayment}
        estimatedMonthly={monthly.total}
      />
    </div>
  );
}

/**
 * Optional lead capture under the calculator. Submits the visitor's contact
 * details together with the live estimate snapshot as a buyer lead. The numbers
 * are read from the calculator, so the visitor only fills in how to reach them.
 */
function EstimateLeadForm({
  homePrice,
  downPayment,
  estimatedMonthly,
}: {
  homePrice: number;
  downPayment: number;
  estimatedMonthly: number;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    setServerError(null);
    const result = await submitMortgageLead({
      ...values,
      home_price: homePrice,
      down_payment: downPayment,
      estimated_monthly: estimatedMonthly,
    });
    if (!result.ok) {
      setServerError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Thanks — we&apos;ll be in touch.</p>
        <p className="mt-1 text-sm text-green-700">
          An agent will review your numbers and reach out shortly.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-medium tracking-tight text-ink">
            Want an agent to review these numbers?
          </p>
          <p className="mt-1 text-sm text-muted">
            We&apos;ll send your estimate of {currency.format(estimatedMonthly)}/mo to an
            agent who can talk through real rates and next steps.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-ink px-5 py-3 font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
        >
          Talk to an agent
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-line bg-surface p-6"
    >
      <p className="text-sm text-muted">
        We&apos;ll include your estimate of{" "}
        <span className="font-medium text-ink">
          {currency.format(estimatedMonthly)}/mo
        </span>{" "}
        on a {currency.format(homePrice)} home.
      </p>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
        <input {...register("full_name")} className="form-input" placeholder="Jane Doe" />
        {errors.full_name && (
          <span className="mt-1 block text-sm text-red-600">{errors.full_name.message}</span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input
            {...register("email")}
            type="email"
            className="form-input"
            placeholder="jane@example.com"
          />
          {errors.email && (
            <span className="mt-1 block text-sm text-red-600">{errors.email.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Phone (optional)</span>
          <input
            {...register("phone")}
            type="tel"
            className="form-input"
            placeholder="(310) 555-0148"
          />
          {errors.phone && (
            <span className="mt-1 block text-sm text-red-600">{errors.phone.message}</span>
          )}
        </label>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-ink px-4 py-3 font-semibold text-background transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send my estimate to an agent"}
      </button>
    </form>
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
