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
      <Section
        title="Brand & hero"
        description="Your business name and the first thing visitors see at the top of your homepage."
      >
        <Field
          label="Company name"
          required
          hint="Shown in your site header, footer, and the browser tab. This one is required."
        >
          <input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} className="form-input" placeholder="e.g. California Realty Group" />
        </Field>
        <Field
          label="Hero title"
          hint="The big headline on your homepage. Leave blank to use the default."
        >
          <input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} className="form-input" placeholder="e.g. Find the home that feels like arrival." />
        </Field>
        <Field
          label="Hero subtitle"
          hint="The supporting sentence right under the homepage headline."
        >
          <textarea rows={2} value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section
        title="About"
        description="The 'About' block on your homepage and About page."
      >
        <Field label="About title" hint="Heading for your About section.">
          <input value={form.about_title} onChange={(e) => set("about_title", e.target.value)} className="form-input" placeholder="e.g. Meet your agent" />
        </Field>
        <Field
          label="About text"
          hint="A short bio or company description. A couple of short paragraphs works best."
        >
          <textarea rows={4} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section
        title="Contact & footer"
        description="How clients reach you. These appear on your contact page and in the footer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" hint="Shown on the contact page and footer.">
            <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className="form-input" placeholder="(310) 555-0148" />
          </Field>
          <Field label="Email" hint="Where client inquiries should reach you.">
            <input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} className="form-input" placeholder="you@yourbrokerage.com" />
          </Field>
        </div>
        <Field label="Office address" hint="Displayed on your contact page.">
          <input value={form.office_address} onChange={(e) => set("office_address", e.target.value)} className="form-input" />
        </Field>
        <Field
          label="Footer tagline"
          hint="The small line of text under your logo at the bottom of every page."
        >
          <input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section
        title="Social links"
        description="Links to your profiles. Paste the full address, or leave a field blank to hide that icon."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Facebook">
            <input value={form.social_links.facebook} onChange={(e) => setSocial("facebook", e.target.value)} className="form-input" placeholder="https://facebook.com/yourpage" />
          </Field>
          <Field label="Instagram">
            <input value={form.social_links.instagram} onChange={(e) => setSocial("instagram", e.target.value)} className="form-input" placeholder="https://instagram.com/yourhandle" />
          </Field>
          <Field label="LinkedIn">
            <input value={form.social_links.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} className="form-input" placeholder="https://linkedin.com/in/you" />
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

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">{title}</h2>
        {description && <p className="mt-1.5 text-xs leading-relaxed text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {hint && <span className="mb-1.5 block text-xs leading-relaxed text-faint">{hint}</span>}
      {children}
    </label>
  );
}
