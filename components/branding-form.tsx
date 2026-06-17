"use client";

/**
 * Branding editor — colors, identity, and logo/agent photo (Supabase Storage).
 * Persists to brand_settings via updateBrandSettings; revalidates the site.
 */
import { useState } from "react";
import { HelpCircle, ExternalLink } from "lucide-react";
import ColorPicker from "@/components/color-picker";
import ImageUpload from "@/components/image-upload";
import { updateBrandSettings } from "@/lib/admin-actions";
import type { BrandSettingsInput } from "@/lib/form-schemas";
import type { BrandSettings } from "@/lib/types";

function toInput(b: BrandSettings | null): BrandSettingsInput {
  return {
    primary_color: b?.primary_color ?? "#006aff",
    secondary_color: b?.secondary_color ?? "#15181f",
    accent_color: b?.accent_color ?? "#0a53c2",
    company_name: b?.company_name ?? "",
    agent_name: b?.agent_name ?? "",
    license_number: b?.license_number ?? "",
    brokerage_name: b?.brokerage_name ?? "",
    logo_url: b?.logo_url ?? null,
    logo_light_url: b?.logo_light_url ?? null,
    agent_photo_url: b?.agent_photo_url ?? null,
    hero_image_url: b?.hero_image_url ?? null,
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
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Colors</h2>
            {/* Tooltip: how to see the change live */}
            <span className="group relative inline-flex">
              <HelpCircle className="h-3.5 w-3.5 cursor-help text-faint" tabIndex={0} aria-label="How to see your color changes" />
              <span className="pointer-events-none absolute left-1/2 top-5 z-20 w-64 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs font-normal normal-case leading-relaxed tracking-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                After you pick colors, click Save branding. Then open your live
                site (use View site, top right) and hard-refresh the page to see
                the new colors: press Ctrl+F5 on Windows, or Cmd+Shift+R on Mac.
              </span>
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Your brand colors, applied across your public website.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorPicker label="Primary color" value={form.primary_color} onChange={(v) => set("primary_color", v)} />
          <ColorPicker label="Accent color" value={form.accent_color} onChange={(v) => set("accent_color", v)} />
        </div>
        <p className="text-xs leading-relaxed text-faint">
          <strong className="font-semibold text-muted">Primary</strong> is the main
          color for buttons, links, and icons.{" "}
          <strong className="font-semibold text-muted">Accent</strong> is used for
          section titles, emphasis, and hover states. After you save, open your
          live site and hard-refresh it (Ctrl+F5 on Windows, or Cmd+Shift+R on
          Mac) to see the new colors.
        </p>
      </div>

      <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Identity</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Who you are. This appears throughout your site and listings.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agent name" hint="Shown in the homepage agent section and on listings.">
            <input value={form.agent_name} onChange={(e) => set("agent_name", e.target.value)} className="form-input" placeholder="e.g. Marcus Rivera" />
          </Field>
          <Field label="Brokerage name" hint="Your brokerage, shown alongside your license.">
            <input value={form.brokerage_name} onChange={(e) => set("brokerage_name", e.target.value)} className="form-input" />
          </Field>
        </div>
      </div>

      <div className="space-y-6 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Assets</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Your logo and agent photo. PNG with a transparent background works best for logos.
          </p>
        </div>
        <div>
          <ImageUpload
            label="Logo"
            multiple={false}
            value={form.logo_url ? [form.logo_url] : []}
            onChange={(urls) => set("logo_url", urls[urls.length - 1] ?? null)}
          />
          <p className="mt-2 text-xs leading-relaxed text-faint">
            Your main logo, shown in the site header (on a light background).
          </p>
        </div>
        <div>
          <ImageUpload
            label="Agent photo"
            multiple={false}
            value={form.agent_photo_url ? [form.agent_photo_url] : []}
            onChange={(urls) => set("agent_photo_url", urls[urls.length - 1] ?? null)}
          />
          <p className="mt-2 text-xs leading-relaxed text-faint">
            A headshot shown in the agent section of your homepage.
          </p>
        </div>
      </div>

      <div className="space-y-3">
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

        {status === "saved" && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-accent/30 bg-accent-soft/50 p-3 text-sm text-ink">
            <span>
              Saved. To see it, open your live site and hard-refresh:{" "}
              <strong className="font-semibold">Ctrl+F5</strong> on Windows, or{" "}
              <strong className="font-semibold">Cmd+Shift+R</strong> on Mac.
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
            >
              Open live site <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mb-1.5 block text-xs leading-relaxed text-faint">{hint}</span>}
      {children}
    </label>
  );
}
