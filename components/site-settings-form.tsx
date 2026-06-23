"use client";

/**
 * Website editor form — edits the site_settings marketing copy and persists it
 * via the updateSiteSettings Server Action. Changes revalidate the public site.
 */
import { useState } from "react";
import { updateSiteSettings } from "@/lib/admin-actions";
import {
  DEFAULT_STATS,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_WHYUS_CARDS,
  HIGHLIGHT_ICONS,
  type SiteSettingsInput,
} from "@/lib/form-schemas";
import type { SiteSettings } from "@/lib/types";
import AddressAutocomplete from "@/components/address-autocomplete";
import AiFieldAssist from "@/components/ai-field-assist";
import ImageUpload from "@/components/image-upload";
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
    highlights_eyebrow: s?.highlights_eyebrow ?? "",
    highlights_title: s?.highlights_title ?? "",
    highlights_subtitle: s?.highlights_subtitle ?? "",
    highlights_cards:
      s?.highlights_cards && s.highlights_cards.length === 3
        ? s.highlights_cards.map((c) => ({
            icon: c.icon as SiteSettingsInput["highlights_cards"][number]["icon"],
            title: c.title,
            description: c.description,
            date: c.date,
          }))
        : DEFAULT_HIGHLIGHTS.map((c) => ({ ...c })),
    whyus_eyebrow: s?.whyus_eyebrow ?? "",
    whyus_title: s?.whyus_title ?? "",
    whyus_feature_title: s?.whyus_feature_title ?? "",
    whyus_feature_text: s?.whyus_feature_text ?? "",
    whyus_feature_button: s?.whyus_feature_button ?? "",
    whyus_feature_image: s?.whyus_feature_image ?? "",
    whyus_market_label: s?.whyus_market_label ?? "",
    whyus_market_caption: s?.whyus_market_caption ?? "",
    whyus_cards:
      s?.whyus_cards && s.whyus_cards.length === 4
        ? s.whyus_cards.map((c) => ({
            icon: c.icon as SiteSettingsInput["whyus_cards"][number]["icon"],
            title: c.title,
            text: c.text,
            image: c.image,
          }))
        : DEFAULT_WHYUS_CARDS.map((c) => ({ ...c })),
    properties_eyebrow: s?.properties_eyebrow ?? "",
    properties_title: s?.properties_title ?? "",
    openhouses_eyebrow: s?.openhouses_eyebrow ?? "",
    openhouses_title: s?.openhouses_title ?? "",
    openhouses_subtitle: s?.openhouses_subtitle ?? "",
    valuation_eyebrow: s?.valuation_eyebrow ?? "",
    valuation_title: s?.valuation_title ?? "",
    valuation_subtitle: s?.valuation_subtitle ?? "",
    mortgage_eyebrow: s?.mortgage_eyebrow ?? "",
    mortgage_title: s?.mortgage_title ?? "",
    mortgage_subtitle: s?.mortgage_subtitle ?? "",
    terms_body: s?.terms_body ?? "",
    terms_updated: s?.terms_updated ?? "",
    privacy_body: s?.privacy_body ?? "",
    privacy_updated: s?.privacy_updated ?? "",
  };
}

type PageView =
  | "home"
  | "about"
  | "contact"
  | "properties"
  | "openhouses"
  | "valuation"
  | "mortgage"
  | "terms"
  | "privacy";

export default function SiteSettingsForm({
  initial,
  aiConnected = false,
  page,
}: {
  initial: SiteSettings | null;
  aiConnected?: boolean;
  /** When set, only that page's sections render (used by the Pages hub). */
  page?: PageView;
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

  function setHighlight(
    index: number,
    patch: Partial<SiteSettingsInput["highlights_cards"][number]>
  ) {
    setForm((prev) => ({
      ...prev,
      highlights_cards: prev.highlights_cards.map((c, i) =>
        i === index ? { ...c, ...patch } : c
      ),
    }));
    setStatus("idle");
  }

  function setWhyusCard(
    index: number,
    patch: Partial<SiteSettingsInput["whyus_cards"][number]>
  ) {
    setForm((prev) => ({
      ...prev,
      whyus_cards: prev.whyus_cards.map((c, i) =>
        i === index ? { ...c, ...patch } : c
      ),
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

  const show = (p: PageView) => !page || page === p;

  return (
    <div className="space-y-6">
      {show("home") && (
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
      )}

      {show("about") && (
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
      )}

      {show("about") && (
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
      )}

      {show("home") && (
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
      )}

      {show("home") && (
      <Section
        title="Homepage highlights"
        description="The 'Recent results' section on your homepage: the heading, intro, and three activity cards (recent sales, new listings, escrows). Leave a field blank to use the default."
      >
        <Field label="Eyebrow" hint="Small label above the heading. Default: 'Recent results'.">
          <input value={form.highlights_eyebrow} onChange={(e) => set("highlights_eyebrow", e.target.value)} className="form-input" placeholder="Recent results" />
        </Field>
        <Field
          label="Heading"
          hint="Default: 'Momentum you can feel.'"
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="a short, confident heading for a real estate 'recent results' homepage section (under 6 words)"
              getCurrent={() => form.highlights_title}
              getContext={brandContext}
              onResult={(t) => set("highlights_title", t)}
            />
          }
        >
          <input value={form.highlights_title} onChange={(e) => set("highlights_title", e.target.value)} className="form-input" placeholder="Momentum you can feel." />
        </Field>
        <Field
          label="Intro text"
          hint="The paragraph under the heading."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one or two sentences summarizing a real estate agent's recent market activity (listings, escrows, closings)"
              getCurrent={() => form.highlights_subtitle}
              getContext={brandContext}
              onResult={(t) => set("highlights_subtitle", t)}
            />
          }
        >
          <textarea rows={3} value={form.highlights_subtitle} onChange={(e) => set("highlights_subtitle", e.target.value)} className="form-input" placeholder="New listings, fresh escrows, and over-ask closings across LA's best neighborhoods." />
        </Field>

        <div className="space-y-4 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">The three activity cards</p>
          {form.highlights_cards.map((card, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[7rem_1fr_1fr_8rem]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Icon</span>
                <select
                  value={card.icon}
                  onChange={(e) =>
                    setHighlight(i, {
                      icon: e.target.value as SiteSettingsInput["highlights_cards"][number]["icon"],
                    })
                  }
                  className="form-input"
                >
                  {HIGHLIGHT_ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Title</span>
                <input value={card.title} onChange={(e) => setHighlight(i, { title: e.target.value })} className="form-input" placeholder="Sold over ask" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Detail</span>
                <input value={card.description} onChange={(e) => setHighlight(i, { description: e.target.value })} className="form-input" placeholder="Bel Air · 9 days on market" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-faint">Date</span>
                <input value={card.date} onChange={(e) => setHighlight(i, { date: e.target.value })} className="form-input" placeholder="Closed last week" />
              </label>
            </div>
          ))}
        </div>
      </Section>
      )}

      {show("home") && (
      <Section
        title="Why work with us"
        description="The bento section on your homepage: the heading, the large image tile, the 'On market' stat card, and the four feature cards. Leave a field blank to use the default."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" hint="Small label above the heading. Default: 'Why work with us'.">
            <input value={form.whyus_eyebrow} onChange={(e) => set("whyus_eyebrow", e.target.value)} className="form-input" placeholder="Why work with us" />
          </Field>
          <Field label="Heading" hint="Default: 'A calmer way to buy and sell.'">
            <input value={form.whyus_title} onChange={(e) => set("whyus_title", e.target.value)} className="form-input" placeholder="A calmer way to buy and sell." />
          </Field>
        </div>

        <div className="space-y-4 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">Large image tile</p>
          <Field label="Title" hint="Default: 'Listings worth the drive'.">
            <input value={form.whyus_feature_title} onChange={(e) => set("whyus_feature_title", e.target.value)} className="form-input" placeholder="Listings worth the drive" />
          </Field>
          <Field
            label="Text"
            hint="The paragraph on the large tile."
            action={
              <AiFieldAssist
                aiConnected={aiConnected}
                instruction="one or two sentences on why a real estate agent's listings are worth viewing (vetted, well photographed, fairly priced)"
                getCurrent={() => form.whyus_feature_text}
                getContext={brandContext}
                onResult={(t) => set("whyus_feature_text", t)}
              />
            }
          >
            <textarea rows={2} value={form.whyus_feature_text} onChange={(e) => set("whyus_feature_text", e.target.value)} className="form-input" placeholder="Every home is vetted in person, photographed properly, and priced with real comps — no surprises at the showing." />
          </Field>
          <Field label="Button text" hint="Links to your listings page. Default: 'See the collection'.">
            <input value={form.whyus_feature_button} onChange={(e) => set("whyus_feature_button", e.target.value)} className="form-input" placeholder="See the collection" />
          </Field>
          <ImageUpload
            label="Image (defaults to your homepage hero image when empty)"
            multiple={false}
            value={form.whyus_feature_image ? [form.whyus_feature_image] : []}
            onChange={(urls) => set("whyus_feature_image", urls[urls.length - 1] ?? "")}
          />
        </div>

        <div className="space-y-4 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">
            &quot;On market&quot; stat card{" "}
            <span className="font-normal text-faint">
              — the big number comes from your second Highlight stat above.
            </span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label" hint="Small label. Default: 'On market'.">
              <input value={form.whyus_market_label} onChange={(e) => set("whyus_market_label", e.target.value)} className="form-input" placeholder="On market" />
            </Field>
            <Field label="Caption" hint="Line under the number. Default: 'median days before an offer'.">
              <input value={form.whyus_market_caption} onChange={(e) => set("whyus_market_caption", e.target.value)} className="form-input" placeholder="median days before an offer" />
            </Field>
          </div>
        </div>

        <div className="space-y-5 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">The four feature cards</p>
          {form.whyus_cards.map((card, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line bg-background/50 p-4">
              <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-faint">Icon</span>
                  <select
                    value={card.icon}
                    onChange={(e) =>
                      setWhyusCard(i, {
                        icon: e.target.value as SiteSettingsInput["whyus_cards"][number]["icon"],
                      })
                    }
                    className="form-input"
                  >
                    {HIGHLIGHT_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-faint">Title</span>
                  <input value={card.title} onChange={(e) => setWhyusCard(i, { title: e.target.value })} className="form-input" placeholder="Block-by-block local" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-faint">Text</span>
                  <AiFieldAssist
                    aiConnected={aiConnected}
                    instruction="one short sentence describing a real estate service benefit (under 16 words, no period needed)"
                    getCurrent={() => card.text}
                    getContext={brandContext}
                    onResult={(t) => setWhyusCard(i, { text: t })}
                  />
                </span>
                <textarea rows={2} value={card.text} onChange={(e) => setWhyusCard(i, { text: e.target.value })} className="form-input" placeholder="Deep neighborhood knowledge, street by street." />
              </label>
              <ImageUpload
                label="Card image"
                multiple={false}
                value={card.image ? [card.image] : []}
                onChange={(urls) => setWhyusCard(i, { image: urls[urls.length - 1] ?? "" })}
              />
            </div>
          ))}
        </div>
      </Section>
      )}

      {show("properties") && (
      <Section
        title="Properties page"
        description="The heading at the top of your listings page. The line below the heading shows your live listing count automatically. Leave a field blank to use the default."
      >
        <Field label="Eyebrow" hint="Small label above the heading. Default: 'For sale'.">
          <input value={form.properties_eyebrow} onChange={(e) => set("properties_eyebrow", e.target.value)} className="form-input" placeholder="For sale" />
        </Field>
        <Field
          label="Heading"
          hint="Default: 'Homes across Los Angeles'."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="a short, inviting heading for a real estate listings page (under 7 words)"
              getCurrent={() => form.properties_title}
              getContext={brandContext}
              onResult={(t) => set("properties_title", t)}
            />
          }
        >
          <input value={form.properties_title} onChange={(e) => set("properties_title", e.target.value)} className="form-input" placeholder="Homes across Los Angeles" />
        </Field>
      </Section>
      )}

      {show("openhouses") && (
      <Section
        title="Open Houses page"
        description="The heading and intro at the top of your open houses page. The events list below fills in automatically. Leave a field blank to use the default."
      >
        <Field label="Eyebrow" hint="Small label above the heading. Default: 'This week'.">
          <input value={form.openhouses_eyebrow} onChange={(e) => set("openhouses_eyebrow", e.target.value)} className="form-input" placeholder="This week" />
        </Field>
        <Field
          label="Heading"
          hint="Default: 'Open houses'."
        >
          <input value={form.openhouses_title} onChange={(e) => set("openhouses_title", e.target.value)} className="form-input" placeholder="Open houses" />
        </Field>
        <Field
          label="Intro text"
          hint="The sentence under the heading. Default: 'Tour homes in person across Los Angeles County.'"
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one inviting sentence for a real estate open houses page (one sentence)"
              getCurrent={() => form.openhouses_subtitle}
              getContext={brandContext}
              onResult={(t) => set("openhouses_subtitle", t)}
            />
          }
        >
          <textarea rows={2} value={form.openhouses_subtitle} onChange={(e) => set("openhouses_subtitle", e.target.value)} className="form-input" placeholder="Tour homes in person across Los Angeles County." />
        </Field>
      </Section>
      )}

      {show("valuation") && (
      <Section
        title="Home Value page"
        description="The heading and intro on your home valuation page. The valuation form beside it stays as-is. Leave a field blank to use the default."
      >
        <Field label="Eyebrow" hint="Small label above the heading. Default: 'Sellers'.">
          <input value={form.valuation_eyebrow} onChange={(e) => set("valuation_eyebrow", e.target.value)} className="form-input" placeholder="Sellers" />
        </Field>
        <Field
          label="Heading"
          hint="Default: 'What's your home worth?'"
        >
          <input value={form.valuation_title} onChange={(e) => set("valuation_title", e.target.value)} className="form-input" placeholder="What's your home worth?" />
        </Field>
        <Field
          label="Intro text"
          hint="The paragraph under the heading."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one or two sentences inviting a homeowner to get a free home valuation from a local real estate agent"
              getCurrent={() => form.valuation_subtitle}
              getContext={brandContext}
              onResult={(t) => set("valuation_subtitle", t)}
            />
          }
        >
          <textarea rows={3} value={form.valuation_subtitle} onChange={(e) => set("valuation_subtitle", e.target.value)} className="form-input" placeholder="Get a free, personalized valuation based on recent sales and current market conditions in your LA neighborhood." />
        </Field>
      </Section>
      )}

      {show("mortgage") && (
      <Section
        title="Mortgage page"
        description="The heading and intro above your mortgage calculator. The calculator itself stays as-is. Leave a field blank to use the default."
      >
        <Field label="Eyebrow" hint="Small label above the heading. Default: 'Buyers'.">
          <input value={form.mortgage_eyebrow} onChange={(e) => set("mortgage_eyebrow", e.target.value)} className="form-input" placeholder="Buyers" />
        </Field>
        <Field
          label="Heading"
          hint="Default: 'Mortgage calculator'."
        >
          <input value={form.mortgage_title} onChange={(e) => set("mortgage_title", e.target.value)} className="form-input" placeholder="Mortgage calculator" />
        </Field>
        <Field
          label="Intro text"
          hint="The sentence under the heading. Default: 'Estimate your monthly payment including taxes and insurance.'"
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              instruction="one helpful sentence introducing a mortgage payment calculator for homebuyers (one sentence)"
              getCurrent={() => form.mortgage_subtitle}
              getContext={brandContext}
              onResult={(t) => set("mortgage_subtitle", t)}
            />
          }
        >
          <textarea rows={2} value={form.mortgage_subtitle} onChange={(e) => set("mortgage_subtitle", e.target.value)} className="form-input" placeholder="Estimate your monthly payment including taxes and insurance." />
        </Field>
      </Section>
      )}

      {show("terms") && (
      <Section
        title="Terms of Service"
        description="The body of your Terms of Service page. Blank lines separate paragraphs. Have it reviewed by qualified counsel before launch. Leave the body blank to use the default template."
      >
        <Field label="Last updated" hint="Shown under the title, e.g. 'June 23, 2026'. Leave blank to hide it.">
          <input value={form.terms_updated} onChange={(e) => set("terms_updated", e.target.value)} className="form-input" placeholder="June 23, 2026" />
        </Field>
        <Field
          label="Body"
          hint="Your full terms. Press Enter twice to start a new paragraph."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              maxTokens={1400}
              instruction="a clear, plain-English Terms of Service for a real estate agent's website, as short titled paragraphs (use of the site, accuracy of listings, no warranty, intellectual property, limitation of liability, governing law, contact). Keep it general and note it should be reviewed by counsel."
              getCurrent={() => form.terms_body}
              getContext={brandContext}
              onResult={(t) => set("terms_body", t)}
            />
          }
        >
          <textarea rows={16} value={form.terms_body} onChange={(e) => set("terms_body", e.target.value)} className="form-input" placeholder="Paste or write your Terms of Service here…" />
        </Field>
      </Section>
      )}

      {show("privacy") && (
      <Section
        title="Privacy Policy"
        description="The body of your Privacy Policy page. Blank lines separate paragraphs. Have it reviewed by qualified counsel before launch. Leave the body blank to use the default template."
      >
        <Field label="Last updated" hint="Shown under the title, e.g. 'June 23, 2026'. Leave blank to hide it.">
          <input value={form.privacy_updated} onChange={(e) => set("privacy_updated", e.target.value)} className="form-input" placeholder="June 23, 2026" />
        </Field>
        <Field
          label="Body"
          hint="Your full privacy policy. Press Enter twice to start a new paragraph."
          action={
            <AiFieldAssist
              aiConnected={aiConnected}
              maxTokens={1400}
              instruction="a clear, plain-English Privacy Policy for a real estate agent's website, as short titled paragraphs (information we collect, how we use it, cookies and analytics, sharing with third parties, data retention, your rights, contact). Keep it general and note it should be reviewed by counsel."
              getCurrent={() => form.privacy_body}
              getContext={brandContext}
              onResult={(t) => set("privacy_body", t)}
            />
          }
        >
          <textarea rows={16} value={form.privacy_body} onChange={(e) => set("privacy_body", e.target.value)} className="form-input" placeholder="Paste or write your Privacy Policy here…" />
        </Field>
      </Section>
      )}

      {show("contact") && (
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
      )}

      {show("contact") && (
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
      )}

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
