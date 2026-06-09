"use client";

/**
 * Account settings. Phase 1: local form state. Phase 2 loads + persists profile
 * and contact details to Supabase.
 */
import { useState } from "react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("Sophia Carter");
  const [email, setEmail] = useState("demo@getpropdrive.com");
  const [phone, setPhone] = useState("(619) 555-0148");

  function handleSave() {
    // TODO(phase-2): persist profile + contact details to Supabase.
    console.info("[settings] save", { fullName, email, phone });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>

      <div className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Profile</h2>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="form-input" />
        </label>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-accent"
        >
          Save settings
        </button>
      </div>
    </div>
  );
}
