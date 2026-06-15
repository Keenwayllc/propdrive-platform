"use client";

/**
 * Dashboard manager for homepage testimonials. Each row edits/saves/deletes a
 * testimonial; the card at the bottom adds a new one. All changes hit Server
 * Actions and refresh the route so the public site updates immediately.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/admin-actions";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsManager({
  initial,
}: {
  initial: Testimonial[];
}) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No testimonials yet. Add your first one below.
        </p>
      )}
      {initial.map((t) => (
        <Row key={t.id} item={t} onChanged={refresh} />
      ))}
      <NewRow nextOrder={initial.length + 1} onChanged={refresh} />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function Row({ item, onChanged }: { item: Testimonial; onChanged: () => void }) {
  const [quote, setQuote] = useState(item.quote);
  const [name, setName] = useState(item.author_name);
  const [detail, setDetail] = useState(item.author_detail);
  const [active, setActive] = useState(item.active);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await updateTestimonial(item.id, {
      quote,
      author_name: name,
      author_detail: detail,
      sort_order: item.sort_order,
      active,
    });
    setBusy(false);
    setErr(!res.ok);
    setMsg(res.ok ? "Saved." : res.error ?? "Could not save.");
    if (res.ok) onChanged();
  }

  async function remove() {
    if (!window.confirm("Delete this testimonial?")) return;
    setBusy(true);
    const res = await deleteTestimonial(item.id);
    setBusy(false);
    if (!res.ok) {
      setErr(true);
      setMsg(res.error ?? "Could not delete.");
      return;
    }
    onChanged();
  }

  return (
    <Card>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Quote</span>
        <textarea
          rows={3}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="form-input"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Client name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Detail</span>
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="form-input"
            placeholder="e.g. Bought in Westwood"
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Shown on site
        </label>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-sm ${err ? "text-red-600" : "text-green-600"}`}>{msg}</span>
          )}
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function NewRow({ nextOrder, onChanged }: { nextOrder: number; onChanged: () => void }) {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    setBusy(true);
    setMsg(null);
    const res = await createTestimonial({
      quote,
      author_name: name,
      author_detail: detail,
      sort_order: nextOrder,
      active: true,
    });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not add.");
      return;
    }
    setQuote("");
    setName("");
    setDetail("");
    onChanged();
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Add a testimonial</p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Quote</span>
        <textarea
          rows={3}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="form-input"
          placeholder="What the client said…"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Client name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Detail</span>
          <input value={detail} onChange={(e) => setDetail(e.target.value)} className="form-input" placeholder="e.g. Sold in Bel Air" />
        </label>
      </div>
      <div className="flex items-center justify-end gap-3">
        {msg && <span className="text-sm text-red-600">{msg}</span>}
        <button
          type="button"
          onClick={add}
          disabled={busy || !quote.trim() || !name.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {busy ? "Adding…" : "Add testimonial"}
        </button>
      </div>
    </Card>
  );
}
