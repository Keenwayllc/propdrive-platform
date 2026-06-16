"use client";

/**
 * Dashboard manager for neighborhoods / market areas. Each row edits/saves/
 * deletes one; the card at the bottom adds a new one. Images upload to Supabase
 * Storage. All changes hit Server Actions and refresh so the site updates.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Eraser, RotateCcw } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import {
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
} from "@/lib/admin-actions";
import AiFieldAssist from "@/components/ai-field-assist";
import type { Neighborhood } from "@/lib/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NeighborhoodsManager({
  initial,
  aiConnected = false,
}: {
  initial: Neighborhood[];
  aiConnected?: boolean;
}) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No neighborhoods yet. Add your first market area below.
        </p>
      )}
      {initial.map((n) => (
        <Row key={n.id} item={n} onChanged={refresh} aiConnected={aiConnected} />
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
  item: Neighborhood;
  onChanged: () => void;
  aiConnected: boolean;
}) {
  const [name, setName] = useState(item.name);
  const [slug, setSlug] = useState(item.slug);
  const [blurb, setBlurb] = useState(item.blurb);
  const [image, setImage] = useState(item.image_url);
  const [active, setActive] = useState(item.active);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await updateNeighborhood(item.id, {
      name,
      slug,
      blurb,
      image_url: image,
      sort_order: item.sort_order,
      active,
    });
    setBusy(false);
    setErr(!res.ok);
    setMsg(res.ok ? "Saved." : res.error ?? "Could not save.");
    if (res.ok) onChanged();
  }

  function reset() {
    setName(item.name);
    setSlug(item.slug);
    setBlurb(item.blurb);
    setImage(item.image_url);
    setActive(item.active);
    setMsg(null);
    setErr(false);
  }

  async function remove() {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setBusy(true);
    const res = await deleteNeighborhood(item.id);
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
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">URL slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">Blurb</span>
          <AiFieldAssist
            aiConnected={aiConnected}
            label="Write with AI"
            instruction={`a short, appealing one-sentence description of the ${name || "neighborhood"} area in Los Angeles County for a real estate site; be specific and do not invent statistics`}
            getCurrent={() => blurb}
            getContext={() => `Neighborhood: ${name}`}
            onResult={(t) => setBlurb(t)}
          />
        </span>
        <textarea
          rows={2}
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          className="form-input"
        />
      </label>
      <ImageUpload
        label="Photo"
        multiple={false}
        value={image ? [image] : []}
        onChange={(urls) => setImage(urls[urls.length - 1] ?? "")}
      />
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
            title="Undo unsaved edits and restore the saved neighborhood"
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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [blurb, setBlurb] = useState("");
  const [image, setImage] = useState("");
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function onName(v: string) {
    setName(v);
    if (!touchedSlug) setSlug(slugify(v));
  }

  async function add() {
    setBusy(true);
    setMsg(null);
    const res = await createNeighborhood({
      name,
      slug: slug || slugify(name),
      blurb,
      image_url: image,
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
    setName("");
    setSlug("");
    setBlurb("");
    setImage("");
    setTouchedSlug(false);
    setMsg(null);
  }

  const hasInput = Boolean(name || slug || blurb || image);

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Add a neighborhood</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Name</span>
          <input value={name} onChange={(e) => onName(e.target.value)} className="form-input" placeholder="e.g. Pasadena" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">URL slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setTouchedSlug(true);
              setSlug(e.target.value);
            }}
            className="form-input"
            placeholder="pasadena"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">Blurb</span>
          <AiFieldAssist
            aiConnected={aiConnected}
            label="Write with AI"
            instruction={`a short, appealing one-sentence description of the ${name || "neighborhood"} area in Los Angeles County for a real estate site; be specific and do not invent statistics`}
            getCurrent={() => blurb}
            getContext={() => `Neighborhood: ${name}`}
            onResult={(t) => setBlurb(t)}
          />
        </span>
        <textarea
          rows={2}
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          className="form-input"
          placeholder="A short description of the area."
        />
      </label>
      <ImageUpload
        label="Photo"
        multiple={false}
        value={image ? [image] : []}
        onChange={(urls) => setImage(urls[urls.length - 1] ?? "")}
      />
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
          disabled={busy || !name.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {busy ? "Adding…" : "Add neighborhood"}
        </button>
      </div>
    </Card>
  );
}
