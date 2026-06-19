"use client";

/**
 * Website editor form — edits the site_settings marketing copy and persists it
 * via the updateSiteSettings Server Action. Changes revalidate the public site.
 */
import { useState } from "react";
import { updateSiteSettings } from "@/lib/admin-actions";
import { DEFAULT_STATS, type SiteSettingsInput } from "@/lib/form-schemas";
import type { SiteSettings } from "@/lib/types";
import AddressAutocomplete from "@/components/address-autocomplete";
import AiFieldAssist from "@/components/ai-field-assist";
import { SocialIcon, SOCIAL_PLATFORMS, type SocialPlatform } from "@/components/social-icons";

function toInput(s: SiteSettings | null): SiteSettingsInput {
  return {
    company_name: s?.company_name ?? "",
    hero_title: s?.hero_title ?? "",
    hero_subtitle: s?.hero_subtitle ?? "",
    cta_text: s?.cta_text ?? "",
    service_area: s?.service_area ?? "",
    about_title: s?.about_title ?? "",
    about_text: s?.about_text ?? "",
    about_cta_title: s?.about_cta_title ?? "",
    about_cta_text: s?.about_cta_text ?? "",
    about_cta_button: s?.about_cta_button ?? "",
    footer_text: s?.footer_text ?? "",
    contact_phone: s?.contact_phone ?? "",
    contact_email: s?.contact_email ?? "",
    office_address: s?.office_address ?? "",
    social_links: {
      facebook: s?.social_links?.facebook ?? "",
      instagram: s?.social_links?.instagram ?? "",
      twitter: s?.social_links?.twitter ?? "",
      linkedin: s?.social_links?.linkedin ?? "",
      youtube: s?.social_links?.youtube ?? "",
      tiktok: s?.social_links?.tiktok ?? "",
    },
    stats:
      s?.stats && s.stats.length === 3
        ? s.stats.map((t) => ({ value: t.value, suffix: t.suffix, label: t.label }))
        : DEFAULT_STATS,
  };
}

export default function SiteSettingsForm({
  initial,
  aiConnected = false,
}: {
  initial: SiteSettings | null;
  aiConnected?: boolean;
}) {
  const [form, setForm] = useState<SiteSettingsInput>(toInput(initial));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof SiteSettingsInput>(key: K, value: SiteSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function setSocial(key: SocialPlatform, value: string) {
    setForm((prev) => ({ ...prev, social_links: { ...prev.social_links, [key]: value } }));
    setStatus("idle");
  }

  function setStat(index: number, patch: Partial<SiteSettingsInput["stats"][number]>) {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
    setStatus("idle");
  }

  // Grounding context for the AI so generated copy matches the business.
  function brandContext(): string {
    const bits = [
      form.company_name && `Business name: ${form.company_name}`,
      form.service_area && `Service area: ${form.service_area}`,
      "Industry: residential real estate",
      form.about_text && `About: ${form.about_text}`,
    ].filter(Boolean);
    return bits.join(". ");
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
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="a short, memorable homepage hero headline for a real estate agent (under 9 words, no period needed)"
              getCurrent={() => form.hero_title}
              getContext={brandContext}
              onResult={(t) => set("hero_title", t)}
            />
          }
        >
          <input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} className="form-input" placeholder="e.g. Find the home that feels like arrival." />
        </Field>
        <Field
          label="Hero subtitle"
          hint="The supporting sentence right under the homepage headline."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one warm supporting sentence under a real estate homepage headline (one sentence)"
              getCurrent={() => form.hero_subtitle}
              getContext={brandContext}
              onResult={(t) => set("hero_subtitle", t)}
            />
          }
        >
          <textarea rows={2} value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} className="form-input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Main CTA text"
            hint="The main homepage button. Leave blank for 'Browse listings'."
          >
            <input value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} className="form-input" placeholder="e.g. Browse listings" />
          </Field>
          <Field
            label="Service area"
            hint="The area you serve, shown as a label above the hero headline."
          >
            <input value={form.service_area} onChange={(e) => set("service_area", e.target.value)} className="form-input" placeholder="e.g. Los Angeles County, California" />
          </Field>
        </div>
      </Section>

      <Section
        title="About"
        description="The 'About' block on your homepage and About page."
      >
        <Field
          label="About title"
          hint="Heading for your About section."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="a short, inviting heading for a real estate agent's About section (under 6 words)"
              getCurrent={() => form.about_title}
              getContext={brandContext}
              onResult={(t) => set("about_title", t)}
            />
          }
        >
          <input value={form.about_title} onChange={(e) => set("about_title", e.target.value)} className="form-input" placeholder="e.g. Meet your agent" />
        </Field>
        <Field
          label="About text"
          hint="A short bio or company description. A couple of short paragraphs works best."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              maxTokens={600}
              instruction="a warm, credible About bio for a real estate agent or brokerage, two short paragraphs"
              getCurrent={() => form.about_text}
              getContext={brandContext}
              onResult={(t) => set("about_text", t)}
            />
          }
        >
          <textarea rows={4} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section
        title="About page CTA"
        description="The call-to-action card at the bottom of your About page. Leave a field blank to use the default."
      >
        <Field
          label="CTA heading"
          hint="The bold line on the card. Default: 'Ready to make your move?'"
        >
          <input value={form.about_cta_title} onChange={(e) => set("about_cta_title", e.target.value)} className="form-input" placeholder="Ready to make your move?" />
        </Field>
        <Field
          label="CTA text"
          hint="The supporting sentence under the heading. Default mentions your agent name and service area."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one warm, low-pressure call-to-action sentence inviting a visitor to reach out to a real estate agent (one sentence)"
              getCurrent={() => form.about_cta_text}
              getContext={brandContext}
              onResult={(t) => set("about_cta_text", t)}
            />
          }
        >
          <textarea rows={2} value={form.about_cta_text} onChange={(e) => set("about_cta_text", e.target.value)} className="form-input" placeholder="Connect with us for a personal, no-pressure conversation about buying or selling." />
        </Field>
        <Field
          label="Button text"
          hint="The button label. It links to your contact page. Default: 'Start a conversation'."
        >
          <input value={form.about_cta_button} onChange={(e) => set("about_cta_button", e.target.value)} className="form-input" placeholder="Start a conversation" />
        </Field>
      </Section>

      <Section
        title="Highlight stats"
        description="The three numbers shown on your homepage and About page. Use the value plus an optional suffix like % or +. For example: 127 / Homes closed, 12 / Years in LA, 4.97 / Client rating."
      >
        <div className="space-y-4">
          {form.stats.map((stat, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[6.5rem_5rem_1fr]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Value</span>
                <input
                  type="number"
                  step="any"
                  value={stat.value}
                  onChange={(e) =>
                    setStat(i, { value: e.target.value === "" ? 0 : Number(e.target.value) })
                  }
                  className="form-input"
                  placeholder="127"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Suffix</span>
                <input
                  value={stat.suffix}
                  maxLength={8}
                  onChange={(e) => setStat(i, { suffix: e.target.value })}
                  className="form-input"
                  placeholder="% / +"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Label</span>
                <input
                  value={stat.label}
                  onChange={(e) => setStat(i, { label: e.target.value })}
                  className="form-input"
                  placeholder="Homes closed"
                />
              </label>
            </div>
          ))}
        </div>
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
        <Field label="Office address" hint="Displayed on your contact page. Start typing for suggestions.">
          <AddressAutocomplete
            value={form.office_address}
            onChange={(v) => set("office_address", v)}
            placeholder="Start typing your office address…"
          />
        </Field>
        <Field
          label="Footer tagline"
          hint="The small line of text under your logo at the bottom of every page."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="a short footer tagline for a real estate agent's website (under 10 words)"
              getCurrent={() => form.footer_text}
              getContext={brandContext}
              onResult={(t) => set("footer_text", t)}
            />
          }
        >
          <input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} className="form-input" />
        </Field>
      </Section>

      <Section
        title="Social links"
        description="Links to your profiles. Paste the full address, or leave a field blank to hide that icon on your site. Icons appear in your footer automatically."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((p) => {
            const key = p.key as SocialPlatform;
            return (
              <label key={p.key} className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-white">
                    <SocialIcon name={key} className="h-3.5 w-3.5" />
                  </span>
                  {p.label}
                </span>
                <input
                  value={form.social_links[key] ?? ""}
                  onChange={(e) => setSocial(key, e.target.value)}
                  className="form-input"
                  placeholder={p.placeholder}
                />
              </label>
            );
          })}
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
  action,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </span>
        {action}
      </span>
      {hint && <span className="mb-1.5 block text-xs leading-relaxed text-faint">{hint}</span>}
      {children}
    </label>
  );
}
