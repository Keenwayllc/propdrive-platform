"use client";

/**
 * Website editor — edit the public site's marketing copy (site_settings).
 * Phase 1: local state only. Phase 2 loads + persists to Supabase.
 */
import { useState } from "react";

interface EditableCopy {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  footer_text: string;
}

const INITIAL: EditableCopy = {
  hero_title: "Find the home that feels like arrival.",
  hero_subtitle: "Expert guidance for buyers and sellers across Los Angeles County.",
  about_title: "About Sophia Carter",
  about_text: "Senior Real Estate Advisor with California Realty Group.",
  footer_text: "The real estate lead platform built for agents.",
};

export default function WebsiteEditorPage() {
  const [copy, setCopy] = useState<EditableCopy>(INITIAL);

  function update<K extends keyof EditableCopy>(key: K, value: string) {
    setCopy((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    // TODO(phase-2): persist to Supabase `site_settings`.
    console.info("[website-editor] save", copy);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Website Editor</h1>
      <p className="text-sm text-muted">
        Edit the copy that appears across your public website.
      </p>

      <div className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
        <Labeled label="Hero title">
          <input
            value={copy.hero_title}
            onChange={(e) => update("hero_title", e.target.value)}
            className="form-input"
          />
        </Labeled>
        <Labeled label="Hero subtitle">
          <input
            value={copy.hero_subtitle}
            onChange={(e) => update("hero_subtitle", e.target.value)}
            className="form-input"
          />
        </Labeled>
        <Labeled label="About title">
          <input
            value={copy.about_title}
            onChange={(e) => update("about_title", e.target.value)}
            className="form-input"
          />
        </Labeled>
        <Labeled label="About text">
          <textarea
            value={copy.about_text}
            onChange={(e) => update("about_text", e.target.value)}
            rows={4}
            className="form-input"
          />
        </Labeled>
        <Labeled label="Footer text">
          <input
            value={copy.footer_text}
            onChange={(e) => update("footer_text", e.target.value)}
            className="form-input"
          />
        </Labeled>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-accent"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
