"use client";

/**
 * Pages hub — one place to edit every page on the site. A dropdown picks the
 * page: built-in pages (Home / About / Contact) open a pre-filled editor backed
 * by site_settings; "Custom pages" opens the create/edit manager for owner-made
 * pages. This replaces the old standalone Website Editor.
 */
import { useState } from "react";
import SiteSettingsForm from "@/components/site-settings-form";
import PagesManager from "@/components/pages-manager";
import type { SiteSettings, Page } from "@/lib/types";

type View =
  | "home"
  | "about"
  | "contact"
  | "properties"
  | "openhouses"
  | "valuation"
  | "mortgage"
  | "custom";

const HELP: Record<View, string> = {
  home: "Your homepage: business name, hero headline, the 'Recent results' section, and stat cards.",
  about: "Your About page: heading, bio, and the call-to-action card.",
  contact: "Your contact details and the site-wide footer (tagline + social links).",
  properties: "Your listings page: the heading above your live properties. The listing count fills in automatically.",
  openhouses: "Your open houses page: the heading and intro. The events list fills in automatically.",
  valuation: "Your home valuation page: the heading and intro beside the valuation form.",
  mortgage: "Your mortgage page: the heading and intro above the calculator.",
  custom: "Pages you create yourself — services, FAQ, team, and more. Each lives at /p/your-slug.",
};

export default function PagesHub({
  settings,
  aiConnected,
  pages,
}: {
  settings: SiteSettings | null;
  aiConnected: boolean;
  pages: Page[];
}) {
  const [view, setView] = useState<View>("home");

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Choose a page to edit
          </span>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as View)}
            className="form-input max-w-sm"
          >
            <optgroup label="Built-in pages">
              <option value="home">Home page</option>
              <option value="about">About page</option>
              <option value="properties">Properties — page heading</option>
              <option value="openhouses">Open Houses — heading</option>
              <option value="valuation">Home Value — heading</option>
              <option value="mortgage">Mortgage — heading</option>
              <option value="contact">Contact &amp; footer</option>
            </optgroup>
            <optgroup label="Your pages">
              <option value="custom">Custom pages</option>
            </optgroup>
          </select>
        </label>
        <p className="mt-2 text-xs leading-relaxed text-faint">{HELP[view]}</p>
      </div>

      {view === "custom" ? (
        <PagesManager initial={pages} />
      ) : (
        <SiteSettingsForm initial={settings} aiConnected={aiConnected} page={view} />
      )}
    </div>
  );
}
