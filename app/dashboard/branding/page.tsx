"use client";

/**
 * Branding editor — colors, logo, and agent identity (brand_settings).
 * Phase 1: local state only. Phase 2 loads + persists to Supabase + Storage.
 */
import { useState } from "react";
import ColorPicker from "@/components/color-picker";
import ImageUpload from "@/components/image-upload";

export default function BrandingPage() {
  const [primary, setPrimary] = useState("#1d4ed8");
  const [secondary, setSecondary] = useState("#0f172a");
  const [accent, setAccent] = useState("#f59e0b");

  function handleSave() {
    // TODO(phase-2): persist to Supabase `brand_settings` + upload assets.
    console.info("[branding] save", { primary, secondary, accent });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Branding</h1>
      <p className="text-sm text-slate-500">
        Customize colors and assets to match your brokerage&apos;s identity.
      </p>

      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorPicker label="Primary" value={primary} onChange={setPrimary} />
          <ColorPicker label="Secondary" value={secondary} onChange={setSecondary} />
          <ColorPicker label="Accent" value={accent} onChange={setAccent} />
        </div>

        <ImageUpload label="Logo" />
        <ImageUpload label="Agent photo" />

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Save branding
        </button>
      </div>
    </div>
  );
}
