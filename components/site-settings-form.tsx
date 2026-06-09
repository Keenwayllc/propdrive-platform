"use client";

/**
 * Website editor form — edits the site_settings marketing copy and persists it
 * via the updateSiteSettings Server Action. Changes revalidate the public site.
 */
import { useState } from "react";
import { updateSiteSettings } from "@/lib/admin-actions";
import type { SiteSettingsInput } from "@/lib/form-schemas";
import type { SiteSettings } from "@/lib/types";

function toInput(s: SiteSettings | null): SiteSettingsInput {
  return {
    company_name: s?.company_name ?? "",
    hero_title: s?.hero_title ?? "",
    hero_subtitle: s?.hero_subtitle ?? "",
    about_title: s?.about_title ?? "",
    about_text: s?.about_text ?? "",
    footer_text: s?.footer_text ?? "",
    contact_phone: s?.contact_phone ?? "",
    contact_email: s?.contact_email ?? "",
    office_address: s?.office_address ?? "",
    social_links: {
      facebook: s?.social_links?.facebook ?? "",
      instagram: s?.social_links?.instagram ?? "",
      linkedin: s?.social_links?.linkedin ?? "",
    },
  };
}

export default function SiteSettingsForm({
  initial,
}: {
  initial: SiteSettings | null;
}) {
  const [form, setForm] = useState<SiteSettingsInput>(toInput(initial));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof SiteSettingsInput>(key: K, value: SiteSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function setSocial(key: "facebook" | "instagram" | "linkedin", value: string) {
    setForm((prev) => ({ ...prev, social_links: { ...prev.social_links, [key]: value } }));
    setStatus("idle");
  }

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updateSiteSettings(form);
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
      <Section title="Brand & hero">
        <Field label="Company name">
          <input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} className="form-input" />
        </Field>
        <Field label="Hero title">
          <input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} className="form-input" />
        </Field>
        <Field label="Hero subtitle">
          <textarea rows={2} value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section title="About">
        <Field label="About title">
          <input value={form.about_title} onChange={(e) => set("about_title", e.target.value)} className="form-input" />
        </Field>
        <Field label="About text">
          <textarea rows={4} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section title="Contact & footer">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className="form-input" />
          </Field>
          <Field label="Email">
            <input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} className="form-input" />
          </Field>
        </div>
        <Field label="Office address">
          <input value={form.office_address} onChange={(e) => set("office_address", e.target.value)} className="form-input" />
        </Field>
        <Field label="Footer tagline">
          <input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section title="Social links">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Facebook">
            <input value={form.social_links.facebook} onChange={(e) => setSocial("facebook", e.target.value)} className="form-input" placeholder="https://" />
          </Field>
          <Field label="Instagram">
            <input value={form.social_links.instagram} onChange={(e) => setSocial("instagram", e.target.value)} className="form-input" placeholder="https://" />
          </Field>
          <Field label="LinkedIn">
            <input value={form.social_links.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} className="form-input" placeholder="https://" />
          </Field>
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-green-600">Saved.</span>}
        {status === "error" && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">{title}</h2>
      {children}
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
