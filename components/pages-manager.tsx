"use client";

/**
 * Dashboard manager for owner-authored custom pages. Each row edits/updates/
 * deletes a page; the card at the bottom creates a new one. Pages publish to
 * /p/[slug] and can optionally appear in the site nav and/or footer.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, RotateCcw, ExternalLink, Pencil } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { createPage, updatePage, deletePage } from "@/lib/admin-actions";
import type { Page } from "@/lib/types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PagesManager({ initial }: { initial: Page[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No custom pages yet. Create your first one below — like an
          &ldquo;Our Services&rdquo;, &ldquo;FAQ&rdquo;, or &ldquo;Meet the
          Team&rdquo; page.
        </p>
      )}
      {initial.map((p) => (
        <Row key={p.id} item={p} onChanged={refresh} />
      ))}
      <NewRow onChanged={refresh} />
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

function Placement({
  showInNav,
  showInFooter,
  published,
  onNav,
  onFooter,
  onPublished,
}: {
  showInNav: boolean;
  showInFooter: boolean;
  published: boolean;
  onNav: (v: boolean) => void;
  onFooter: (v: boolean) => void;
  onPublished: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={published} onChange={(e) => onPublished(e.target.checked)} />
        Published
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={showInNav} onChange={(e) => onNav(e.target.checked)} />
        Show in top menu
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={showInFooter} onChange={(e) => onFooter(e.target.checked)} />
        Show in footer
      </label>
    </div>
  );
}

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "green" | "muted" }) {
  const cls =
    tone === "green"
      ? "bg-green-100 text-green-700"
      : "bg-surface text-muted border border-line";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>
  );
}

function Row({ item, onChanged }: { item: Page; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [slug, setSlug] = useState(item.slug);
  const [body, setBody] = useState(item.body);
  const [cover, setCover] = useState(item.cover_image_url);
  const [showInNav, setShowInNav] = useState(item.show_in_nav);
  const [showInFooter, setShowInFooter] = useState(item.show_in_footer);
  const [published, setPublished] = useState(item.published);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function update() {
    setBusy(true);
    setMsg(null);
    const res = await updatePage(item.id, {
      title,
      slug,
      body,
      cover_image_url: cover,
      show_in_nav: showInNav,
      show_in_footer: showInFooter,
      published,
      sort_order: item.sort_order,
    });
    setBusy(false);
    setErr(!res.ok);
    setMsg(res.ok ? "Updated." : res.error ?? "Could not update.");
    if (res.ok) {
      onChanged();
      setEditing(false);
    }
  }

  function reset() {
    setTitle(item.title);
    setSlug(item.slug);
    setBody(item.body);
    setCover(item.cover_image_url);
    setShowInNav(item.show_in_nav);
    setShowInFooter(item.show_in_footer);
    setPublished(item.published);
    setMsg(null);
    setErr(false);
  }

  function cancel() {
    reset();
    setEditing(false);
  }

  async function remove() {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setBusy(true);
    const res = await deletePage(item.id);
    setBusy(false);
    if (!res.ok) {
      setErr(true);
      setMsg(res.error ?? "Could not delete.");
      return;
    }
    onChanged();
  }

  // Collapsed list row — title, URL, status badges, View + Edit.
  if (!editing) {
    return (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-ink">{item.title}</p>
            <p className="truncate text-xs text-faint">/p/{item.slug}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.published ? (
                <Badge tone="green">Published</Badge>
              ) : (
                <Badge>Draft</Badge>
              )}
              {item.show_in_nav && <Badge>In menu</Badge>}
              {item.show_in_footer && <Badge>In footer</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/p/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-surface"
            >
              View <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
          </div>
        </div>
        {msg && err && <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Editing: {item.title}</p>
        <a
          href={`/p/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          View page <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">URL slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Body</span>
        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="form-input" />
        <span className="mt-1 block text-xs text-faint">Separate paragraphs with a blank line.</span>
      </label>
      <ImageUpload
        label="Cover image (optional)"
        multiple={false}
        value={cover ? [cover] : []}
        onChange={(urls) => setCover(urls[urls.length - 1] ?? "")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Placement
          showInNav={showInNav}
          showInFooter={showInFooter}
          published={published}
          onNav={setShowInNav}
          onFooter={setShowInFooter}
          onPublished={setPublished}
        />
        <div className="flex items-center gap-3">
          {msg && <span className={`text-sm ${err ? "text-red-600" : "text-green-600"}`}>{msg}</span>}
          <button type="button" onClick={cancel} disabled={busy} title="Discard changes and close" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-surface disabled:opacity-60">
            <RotateCcw className="h-4 w-4" /> Cancel
          </button>
          <button type="button" onClick={remove} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button type="button" onClick={update} disabled={busy} className="rounded-full bg-ink px-6 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
            {busy ? "Updating…" : "Update"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function NewRow({ onChanged }: { onChanged: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [body, setBody] = useState("");
  const [cover, setCover] = useState("");
  const [showInNav, setShowInNav] = useState(false);
  const [showInFooter, setShowInFooter] = useState(false);
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function onTitle(v: string) {
    setTitle(v);
    if (!touchedSlug) setSlug(slugify(v));
  }

  async function add() {
    setBusy(true);
    setMsg(null);
    const res = await createPage({
      title,
      slug: slug || slugify(title),
      body,
      cover_image_url: cover,
      show_in_nav: showInNav,
      show_in_footer: showInFooter,
      published,
      sort_order: 0,
    });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not create.");
      return;
    }
    clear();
    onChanged();
  }

  function clear() {
    setTitle("");
    setSlug("");
    setTouchedSlug(false);
    setBody("");
    setCover("");
    setShowInNav(false);
    setShowInFooter(false);
    setPublished(true);
    setMsg(null);
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Add a new page</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Title</span>
          <input value={title} onChange={(e) => onTitle(e.target.value)} className="form-input" placeholder="e.g. Our Services" />
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
            placeholder="our-services"
          />
          <span className="mt-1 block text-xs text-faint">Lives at /p/{slug || "your-slug"}</span>
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Body</span>
        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="form-input" placeholder="Write your page content. Separate paragraphs with a blank line." />
      </label>
      <ImageUpload
        label="Cover image (optional)"
        multiple={false}
        value={cover ? [cover] : []}
        onChange={(urls) => setCover(urls[urls.length - 1] ?? "")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Placement
          showInNav={showInNav}
          showInFooter={showInFooter}
          published={published}
          onNav={setShowInNav}
          onFooter={setShowInFooter}
          onPublished={setPublished}
        />
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-red-600">{msg}</span>}
          <button type="button" onClick={add} disabled={busy || !title.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
            <Plus className="h-4 w-4" /> {busy ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </Card>
  );
}
