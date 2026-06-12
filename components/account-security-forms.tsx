"use client";

/**
 * Account & security cards for the Settings page: change login email, change
 * password, and sign out of all devices. Each card talks to its own server
 * action and reports inline success/error.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateEmail,
  updatePassword,
  signOutEverywhere,
} from "@/lib/admin-actions";

/* --------------------------------------------------------------- shared UI */

function Card({
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
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="form-input"
      />
    </label>
  );
}

function SubmitRow({
  saving,
  label,
  savingLabel,
  status,
  message,
}: {
  saving: boolean;
  label: string;
  savingLabel: string;
  status: "idle" | "saved" | "error";
  message: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
      >
        {saving ? savingLabel : label}
      </button>
      {status === "saved" && message && (
        <span className="text-sm font-medium text-green-600">{message}</span>
      )}
      {status === "error" && message && (
        <span className="text-sm text-red-600">{message}</span>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- Change email */

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateEmail({ email: email.trim() });
    setSaving(false);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Could not update email.");
      return;
    }
    setStatus("saved");
    setMessage("Check your new inbox to confirm the change.");
    setEmail("");
  }

  return (
    <Card
      title="Login email"
      description={`You currently sign in with ${currentEmail}. Changing it sends a confirmation link to the new address — the change takes effect once you click it.`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="New email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setStatus("idle");
          }}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <SubmitRow
          saving={saving}
          label="Update email"
          savingLabel="Sending…"
          status={status}
          message={message}
        />
      </form>
    </Card>
  );
}

/* -------------------------------------------------------- Change password */

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updatePassword({
      current_password: current,
      new_password: next,
      confirm_password: confirm,
    });
    setSaving(false);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Could not update password.");
      return;
    }
    setStatus("saved");
    setMessage("Password updated.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <Card
      title="Password"
      description="Use at least 8 characters. We'll confirm your current password before saving."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Current password"
          type="password"
          value={current}
          onChange={(v) => {
            setCurrent(v);
            setStatus("idle");
          }}
          autoComplete="current-password"
        />
        <Field
          label="New password"
          type="password"
          value={next}
          onChange={(v) => {
            setNext(v);
            setStatus("idle");
          }}
          autoComplete="new-password"
        />
        <Field
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={(v) => {
            setConfirm(v);
            setStatus("idle");
          }}
          autoComplete="new-password"
        />
        <SubmitRow
          saving={saving}
          label="Update password"
          savingLabel="Saving…"
          status={status}
          message={message}
        />
      </form>
    </Card>
  );
}

/* -------------------------------------------------- Sign out of all devices */

export function SecurityForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignOutAll() {
    setBusy(true);
    setError(null);
    const result = await signOutEverywhere();
    if (!result.ok) {
      setBusy(false);
      setError(result.error ?? "Could not sign out other sessions.");
      return;
    }
    // The current session is invalidated too — send them to login.
    router.push("/auth/login");
  }

  return (
    <Card
      title="Sessions"
      description="Signs you out everywhere — this device and any other browser or phone where you're logged in. Use it if you've lost a device or suspect someone else has access."
    >
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onSignOutAll}
          disabled={busy}
          className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 active:translate-y-px disabled:opacity-60"
        >
          {busy ? "Signing out…" : "Sign out of all devices"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </Card>
  );
}
