"use client";

/**
 * Branding editor — colors, identity, and logo/agent photo (Supabase Storage).
 * Persists to brand_settings via updateBrandSettings; revalidates the site.
 */
import { useState } from "react";
import ColorPicker from "@/components/color-picker";
import ImageUpload from "@/components/image-upload";
import { updateBrandSettings } from "@/lib/admin-actions";
import type { BrandSettingsInput } from "@/lib/form-schemas";
import type { BrandSettings } from "@/lib/types";

function toInput(b: BrandSettings | null): BrandSettingsInput {
  return {
    primary_color: b?.primary_color ?? "#b85c38",
    secondary_color: b?.secondary_color ?? "#1a1714",
    accent_color: b?.accent_color ?? "#b85c38",
    company_name: b?.company_name ?? "",
    agent_name: b?.agent_name ?? "",
    license_number: b?.license_number ?? "",
    brokerage_name: b?.brokerage_name ?? "",
    logo_url: b?.logo_url ?? null,
    logo_light_url: b?.logo_light_url ?? null,
    agent_photo_url: b?.agent_photo_url ?? null,
  };
}

export default function BrandingForm({
  initial,
}: {
  initial: BrandSettings | null;
}) {
  const [form, setForm] = useState<BrandSettingsInput>(toInput(initial));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BrandSettingsInput>(key: K, value: BrandSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updateBrandSettings(form);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Could not save.");
      setStatus("error");
      return;
    }
    setStatus("saved");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Colors</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorPicker label="Primary (accent)" value={form.primary_color} onChange={(v) => set("primary_color", v)} />
          <ColorPicker label="Ink (text)" value={form.secondary_color} onChange={(v) => set("secondary_color", v)} />
          <ColorPicker label="Accent (alt)" value={form.accent_color} onChange={(v) => set("accent_color", v)} />
        </div>
        <p className="text-xs text-faint">
          The primary color is applied as the accent across your public site.
        </p>
      </div>

      <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Identity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} className="form-input" />
          </Field>
          <Field label="Agent name">
            <input value={form.agent_name} onChange={(e) => set("agent_name", e.target.value)} className="form-input" />
          </Field>
          <Field label="Brokerage name">
            <input value={form.brokerage_name} onChange={(e) => set("brokerage_name", e.target.value)} className="form-input" />
          </Field>
          <Field label="License number">
            <input value={form.license_number} onChange={(e) => set("license_number", e.target.value)} className="form-input" />
          </Field>
        </div>
      </div>

      <div className="space-y-6 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Assets</h2>
        <ImageUpload
          label="Logo"
          multiple={false}
          value={form.logo_url ? [form.logo_url] : []}
          onChange={(urls) => set("logo_url", urls[urls.length - 1] ?? null)}
        />
        <div>
          <ImageUpload
            label="Logo — light version (for dark backgrounds)"
            multiple={false}
            value={form.logo_light_url ? [form.logo_light_url] : []}
            onChange={(urls) => set("logo_light_url", urls[urls.length - 1] ?? null)}
          />
          <p className="mt-2 text-xs leading-relaxed text-faint">
            Optional. A white or light version of your logo, shown on dark
            sections like the footer. If you skip this, we automatically place
            your main logo on a light background so it stays legible.
          </p>
        </div>
        <ImageUpload
          label="Agent photo"
          multiple={false}
          value={form.agent_photo_url ? [form.agent_photo_url] : []}
          onChange={(urls) => set("agent_photo_url", urls[urls.length - 1] ?? null)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save branding"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-green-600">Saved.</span>}
        {status === "error" && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
