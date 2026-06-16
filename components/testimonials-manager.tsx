"use client";

/**
 * Dashboard manager for homepage testimonials. Each row edits/saves/deletes a
 * testimonial; the card at the bottom adds a new one. All changes hit Server
 * Actions and refresh the route so the public site updates immediately.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Eraser, RotateCcw, Lightbulb } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/admin-actions";
import AiFieldAssist from "@/components/ai-field-assist";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsManager({
  initial,
  aiConnected = false,
}: {
  initial: Testimonial[];
  aiConnected?: boolean;
}) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-2xl border border-accent/20 bg-accent-soft/40 p-4 text-sm text-ink">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
        <p className="leading-relaxed">
          <span className="font-semibold">Tip:</span> The best testimonials are
          short, specific, and in the client&apos;s own voice. Mention the
          neighborhood, the result (sold in 9 days, found before it hit the
          market), and a feeling. Always use real, permission-given quotes. Feel
          free to lightly polish wording for clarity, just keep it honest.
        </p>
      </div>
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No testimonials yet. Add your first one below.
        </p>
      )}
      {initial.map((t) => (
        <Row key={t.id} item={t} onChanged={refresh} aiConnected={aiConnected} />
      ))}
      <NewRow nextOrder={initial.length + 1} onChanged={refresh} aiConnected={aiConnected} />
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

function Row({
  item,
  onChanged,
  aiConnected,
}: {
  item: Testimonial;
  onChanged: () => void;
  aiConnected: boolean;
}) {
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

  function reset() {
    setQuote(item.quote);
    setName(item.author_name);
    setDetail(item.author_detail);
    setActive(item.active);
    setMsg(null);
    setErr(false);
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
        <span className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">Quote</span>
          <AiFieldAssist
            aiConnected={aiConnected}
            label="Polish"
            instruction="lightly polish this real client testimonial so it reads clearly and warmly in the client's own voice; keep it honest and do not invent facts, names, or results"
            getCurrent={() => quote}
            getContext={() => `Client name: ${name}. Detail: ${detail}`}
            onResult={(t) => setQuote(t)}
          />
        </span>
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
            onClick={reset}
            disabled={busy}
            title="Undo unsaved edits and restore the saved testimonial"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-surface disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
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

function NewRow({
  nextOrder,
  onChanged,
  aiConnected,
}: {
  nextOrder: number;
  onChanged: () => void;
  aiConnected: boolean;
}) {
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
    clearForm();
    onChanged();
  }

  function clearForm() {
    setQuote("");
    setName("");
    setDetail("");
    setMsg(null);
  }

  const hasInput = Boolean(quote || name || detail);

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Add a testimonial</p>
      <label className="block">
        <span className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">Quote</span>
          <AiFieldAssist
            aiConnected={aiConnected}
            label="Polish"
            instruction="polish this client testimonial so it reads clearly and warmly in the client's own voice; keep it honest and do not invent facts, names, or results"
            getCurrent={() => quote}
            getContext={() => `Client name: ${name}. Detail: ${detail}`}
            onResult={(t) => setQuote(t)}
          />
        </span>
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
        {hasInput && (
          <button
            type="button"
            onClick={clearForm}
            disabled={busy}
            title="Clear every field below"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
          >
            <Eraser className="h-4 w-4" /> Clear form
          </button>
        )}
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
