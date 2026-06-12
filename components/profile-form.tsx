"use client";

/**
 * Account settings — edits the signed-in agent's display name. Email and
 * password live in their own cards (see account-security-forms).
 */
import { useState } from "react";
import { updateProfile } from "@/lib/admin-actions";

export default function ProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const [fullName, setFullName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updateProfile({ full_name: fullName });
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Could not save.");
      setStatus("error");
      return;
    }
    setStatus("saved");
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Profile</h2>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
        <input
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setStatus("idle");
          }}
          className="form-input"
        />
        <span className="mt-1 block text-xs text-faint">
          Shown on your public site and in client emails.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-green-600">Saved.</span>}
        {status === "error" && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
