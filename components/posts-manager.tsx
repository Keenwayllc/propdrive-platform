"use client";

/**
 * Dashboard manager for blog / Market Insights posts. Each row edits/saves/
 * deletes a post; the card at the bottom adds a new one. Cover images upload to
 * Supabase Storage. Changes hit Server Actions and refresh the route.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Sparkles, Loader2, HelpCircle, Eraser, RotateCcw } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { createPost, updatePost, deletePost } from "@/lib/admin-actions";
import { generateBlogArticle } from "@/lib/ai-actions";
import type { Post } from "@/lib/types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostsManager({
  initial,
  aiConnected = false,
}: {
  initial: Post[];
  aiConnected?: boolean;
}) {
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
        <Row key={p.id} item={p} onChanged={refresh} aiConnected={aiConnected} />
      ))}
      <NewRow onChanged={refresh} aiConnected={aiConnected} />
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

/**
 * Shared "Write with AI" box. Used in both the new-article card and on each
 * existing article so the owner can draft or rewrite a post from a topic.
 * Calls back with the generated draft so the parent fills its own fields.
 */
function AiWriterBox({
  aiConnected,
  onDraft,
  rewrite = false,
}: {
  aiConnected: boolean;
  onDraft: (article: { title: string; excerpt: string; body: string }) => void;
  rewrite?: boolean;
}) {
  const [topic, setTopic] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState<string | null>(null);

  async function run() {
    setAiBusy(true);
    setAiErr(null);
    const res = await generateBlogArticle(topic);
    setAiBusy(false);
    if (!res.ok) {
      setAiErr(res.error);
      return;
    }
    onDraft(res.article);
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent-strong">
          <Sparkles className="h-4 w-4" /> {rewrite ? "Rewrite with AI" : "Write with AI"}
          {/* Tooltip: short how-to on hover/focus */}
          <span className="group relative inline-flex">
            <HelpCircle className="h-4 w-4 cursor-help text-muted" tabIndex={0} aria-label="How it works" />
            <span className="pointer-events-none absolute left-1/2 top-6 z-20 w-60 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
              {rewrite
                ? "1. Type a new angle or topic. 2. Click Generate. 3. AI rewrites the title, summary, and article. 4. Edit, then Save."
                : "1. Type a topic. 2. Click Generate. 3. AI fills the title, summary, and article. 4. Edit anything, then Publish."}
            </span>
          </span>
        </div>
        {/* Cute connection status */}
        {aiConnected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Your AI assistant is on ✨
          </span>
        ) : (
          <Link
            href="/dashboard/ai-tools"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200"
          >
            Connect OpenAI to turn it on →
          </Link>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {rewrite
          ? "Enter a fresh angle and let AI rewrite this article. Your current text stays until you generate, and you can edit before saving."
          : "Enter a topic and let AI draft the title, summary, and full article. You can edit everything before publishing."}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="form-input"
          placeholder={
            rewrite
              ? "e.g. Make it focus on first-time sellers"
              : "e.g. Spring 2026 market trends for first-time buyers in LA"
          }
        />
        <button
          type="button"
          onClick={run}
          disabled={aiBusy || !topic.trim() || !aiConnected}
          title={aiConnected ? undefined : "Connect your OpenAI key under AI Tools first"}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {aiBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Writing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate
            </>
          )}
        </button>
      </div>
      {aiErr && <p className="mt-2 text-xs text-red-600">{aiErr}</p>}
    </div>
  );
}

function Row({
  item,
  onChanged,
  aiConnected,
}: {
  item: Post;
  onChanged: () => void;
  aiConnected: boolean;
}) {
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

  function reset() {
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt);
    setBody(item.body);
    setAuthor(item.author);
    setCover(item.cover_image_url);
    setPublished(item.published);
    setMsg(null);
    setErr(false);
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
      <AiWriterBox
        aiConnected={aiConnected}
        rewrite
        onDraft={(a) => {
          if (a.title) setTitle(a.title);
          if (a.excerpt) setExcerpt(a.excerpt);
          if (a.body) setBody(a.body);
        }}
      />
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
          <button type="button" onClick={reset} disabled={busy} title="Undo unsaved edits and restore the saved article" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-surface disabled:opacity-60">
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

function NewRow({
  onChanged,
  aiConnected,
}: {
  onChanged: () => void;
  aiConnected: boolean;
}) {
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
    clearForm();
    onChanged();
  }

  function clearForm() {
    setTitle("");
    setSlug("");
    setTouchedSlug(false);
    setExcerpt("");
    setBody("");
    setAuthor("");
    setCover("");
    setMsg(null);
  }

  const hasInput = Boolean(
    title || slug || excerpt || body || author || cover
  );

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">Write a new article</p>

      <AiWriterBox
        aiConnected={aiConnected}
        onDraft={(a) => {
          if (a.title) {
            setTitle(a.title);
            if (!touchedSlug) setSlug(slugify(a.title));
          }
          if (a.excerpt) setExcerpt(a.excerpt);
          setBody(a.body);
        }}
      />

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
        {hasInput && (
          <button type="button" onClick={clearForm} disabled={busy} title="Clear every field below" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-60">
            <Eraser className="h-4 w-4" /> Clear form
          </button>
        )}
        <button type="button" onClick={add} disabled={busy || !title.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
          <Plus className="h-4 w-4" /> {busy ? "Publishing…" : "Publish article"}
        </button>
      </div>
    </Card>
  );
}
