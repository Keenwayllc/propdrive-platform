"use client";

/**
 * Dashboard manager for blog / Market Insights posts. Each row edits/saves/
 * deletes a post; the card at the bottom adds a new one. Cover images upload to
 * Supabase Storage. Changes hit Server Actions and refresh the route.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { createPost, updatePost, deletePost } from "@/lib/admin-actions";
import type { Post } from "@/lib/types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostsManager({ initial }: { initial: Post[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      {initial.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-surface p-6 text-sm text-muted">
          No posts yet. Write your first article below.
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

function Row({ item, onChanged }: { item: Post; onChanged: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [slug, setSlug] = useState(item.slug);
  const [excerpt, setExcerpt] = useState(item.excerpt);
  const [body, setBody] = useState(item.body);
  const [author, setAuthor] = useState(item.author);
  const [cover, setCover] = useState(item.cover_image_url);
  const [published, setPublished] = useState(item.published);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await updatePost(item.id, {
      title,
      slug,
      excerpt,
      body,
      author,
      cover_image_url: cover,
      published,
    });
    setBusy(false);
    setErr(!res.ok);
    setMsg(res.ok ? "Saved." : res.error ?? "Could not save.");
    if (res.ok) onChanged();
  }

  async function remove() {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setBusy(true);
    const res = await deletePost(item.id);
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
          <span className="mb-1 block text-sm font-medium text-ink">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">URL slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Excerpt</span>
        <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="form-input" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Body</span>
        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="form-input" />
        <span className="mt-1 block text-xs text-faint">Separate paragraphs with a blank line.</span>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Author</span>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className="form-input" />
      </label>
      <ImageUpload
        label="Cover image"
        multiple={false}
        value={cover ? [cover] : []}
        onChange={(urls) => setCover(urls[urls.length - 1] ?? "")}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
        <div className="flex items-center gap-3">
          {msg && <span className={`text-sm ${err ? "text-red-600" : "text-green-600"}`}>{msg}</span>}
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

function NewRow({ onChanged }: { onChanged: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function onTitle(v: string) {
    setTitle(v);
    if (!touchedSlug) setSlug(slugify(v));
  }

  async function add() {
    setBusy(true);
    setMsg(null);
    const res = await createPost({
      title,
      slug: slug || slugify(title),
      excerpt,
      body,
      author,
      cover_image_url: cover,
      published: true,
    });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not create.");
      return;
    }
    setTitle("");
    setSlug("");
    setTouchedSlug(false);
    setExcerpt("");
    setBody("");
    setAuthor("");
    setCover("");
    onChanged();
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Write a new article</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Title</span>
          <input value={title} onChange={(e) => onTitle(e.target.value)} className="form-input" placeholder="e.g. Spring Market Update" />
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
            placeholder="spring-market-update"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Excerpt</span>
        <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="form-input" placeholder="A one-line summary shown on the blog index." />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Body</span>
        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="form-input" placeholder="Write your article. Separate paragraphs with a blank line." />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Author</span>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className="form-input" placeholder="Your name" />
      </label>
      <ImageUpload
        label="Cover image"
        multiple={false}
        value={cover ? [cover] : []}
        onChange={(urls) => setCover(urls[urls.length - 1] ?? "")}
      />
      <div className="flex items-center justify-end gap-3">
        {msg && <span className="text-sm text-red-600">{msg}</span>}
        <button type="button" onClick={add} disabled={busy || !title.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
          <Plus className="h-4 w-4" /> {busy ? "Publishing…" : "Publish article"}
        </button>
      </div>
    </Card>
  );
}
