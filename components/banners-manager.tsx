"use client";

/**
 * Dashboard manager for homepage hero banner slides. Each row edits/saves/
 * deletes a slide; the card at the bottom adds a new one. Images upload to
 * Supabase Storage. Slides rotate in the homepage hero in sort order.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Eraser, RotateCcw, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { createBanner, updateBanner, deleteBanner } from "@/lib/admin-actions";
import type { Banner } from "@/lib/types";

export default function BannersManager({ initial }: { initial: Banner[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-2xl border border-accent/20 bg-accent-soft/40 p-4 text-sm text-ink">
        <ImageIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
        <p className="leading-relaxed">
          <span className="font-semibold">Tip:</span> These slides rotate at the
          top of your homepage. Use wide, high-resolution photos (landscape works
          best). Add two or more for the slideshow to rotate. If you add none,
          the homepage uses your default hero from Website Editor and Branding.
        </p>
      </div>
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No banner slides yet. Add your first one below.
        </p>
      )}
      {initial.map((b) => (
        <Row key={b.id} item={b} onChanged={refresh} />
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

function Row({ item, onChanged }: { item: Banner; onChanged: () => void }) {
  const [image, setImage] = useState(item.image_url);
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle);
  const [ctaText, setCtaText] = useState(item.cta_text);
  const [ctaLink, setCtaLink] = useState(item.cta_link);
  const [active, setActive] = useState(item.active);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await updateBanner(item.id, {
      image_url: image,
      title,
      subtitle,
      cta_text: ctaText,
      cta_link: ctaLink,
      sort_order: item.sort_order,
      active,
    });
    setBusy(false);
    setErr(!res.ok);
    setMsg(res.ok ? "Saved." : res.error ?? "Could not save.");
    if (res.ok) onChanged();
  }

  function reset() {
    setImage(item.image_url);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setCtaText(item.cta_text);
    setCtaLink(item.cta_link);
    setActive(item.active);
    setMsg(null);
    setErr(false);
  }

  async function remove() {
    if (!window.confirm("Delete this banner slide?")) return;
    setBusy(true);
    const res = await deleteBanner(item.id);
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
      <Fields
        image={image}
        setImage={setImage}
        title={title}
        setTitle={setTitle}
        subtitle={subtitle}
        setSubtitle={setSubtitle}
        ctaText={ctaText}
        setCtaText={setCtaText}
        ctaLink={ctaLink}
        setCtaLink={setCtaLink}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Shown on site
        </label>
        <div className="flex items-center gap-3">
          {msg && <span className={`text-sm ${err ? "text-red-600" : "text-green-600"}`}>{msg}</span>}
          <button type="button" onClick={reset} disabled={busy} title="Undo unsaved edits" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-surface disabled:opacity-60">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button type="button" onClick={remove} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button type="button" onClick={save} disabled={busy} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function NewRow({ nextOrder, onChanged }: { nextOrder: number; onChanged: () => void }) {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("/properties");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    setBusy(true);
    setMsg(null);
    const res = await createBanner({
      image_url: image,
      title,
      subtitle,
      cta_text: ctaText,
      cta_link: ctaLink || "/properties",
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
    setImage("");
    setTitle("");
    setSubtitle("");
    setCtaText("");
    setCtaLink("/properties");
    setMsg(null);
  }

  const hasInput = Boolean(image || title || subtitle || ctaText);

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Add a banner slide</p>
      <Fields
        image={image}
        setImage={setImage}
        title={title}
        setTitle={setTitle}
        subtitle={subtitle}
        setSubtitle={setSubtitle}
        ctaText={ctaText}
        setCtaText={setCtaText}
        ctaLink={ctaLink}
        setCtaLink={setCtaLink}
      />
      <div className="flex items-center justify-end gap-3">
        {msg && <span className="text-sm text-red-600">{msg}</span>}
        {hasInput && (
          <button type="button" onClick={clearForm} disabled={busy} title="Clear every field below" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-60">
            <Eraser className="h-4 w-4" /> Clear form
          </button>
        )}
        <button type="button" onClick={add} disabled={busy || !image} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
          <Plus className="h-4 w-4" /> {busy ? "Adding…" : "Add slide"}
        </button>
      </div>
    </Card>
  );
}

/** Shared field set for a banner slide. */
function Fields(p: {
  image: string;
  setImage: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  ctaText: string;
  setCtaText: (v: string) => void;
  ctaLink: string;
  setCtaLink: (v: string) => void;
}) {
  return (
    <>
      <ImageUpload
        label="Slide image"
        multiple={false}
        value={p.image ? [p.image] : []}
        onChange={(urls) => p.setImage(urls[urls.length - 1] ?? "")}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Title</span>
          <input value={p.title} onChange={(e) => p.setTitle(e.target.value)} className="form-input" placeholder="e.g. Find your place in LA" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Subtitle</span>
          <input value={p.subtitle} onChange={(e) => p.setSubtitle(e.target.value)} className="form-input" placeholder="A short supporting line" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Button text</span>
          <input value={p.ctaText} onChange={(e) => p.setCtaText(e.target.value)} className="form-input" placeholder="e.g. Browse listings" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Button link</span>
          <input value={p.ctaLink} onChange={(e) => p.setCtaLink(e.target.value)} className="form-input" placeholder="/properties" />
        </label>
      </div>
    </>
  );
}
