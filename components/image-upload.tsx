"use client";

/**
 * Image uploader backed by Supabase Storage.
 *
 * Uploads selected/dropped files to a public bucket (default `property-images`)
 * using the authenticated browser client, then surfaces the resulting public
 * URLs. Controlled via `value` + `onChange` (a string[] of URLs).
 */
import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export interface ImageUploadProps {
  label?: string;
  /** Current image URLs. */
  value?: string[];
  /** Emits the full URL list whenever it changes. */
  onChange?: (urls: string[]) => void;
  /** Storage bucket to upload into. */
  bucket?: string;
  /** Allow selecting multiple files at once. */
  multiple?: boolean;
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-40);
}

/** Max accepted size per file (matches the "~10MB" UI hint). */
const MAX_BYTES = 10 * 1024 * 1024;
/** Max images kept per property. */
const MAX_IMAGES = 24;

export default function ImageUpload({
  label = "Images",
  value,
  onChange,
  bucket = "property-images",
  multiple = true,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(value ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(next: string[]) {
    setUrls(next);
    onChange?.(next);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);
    const uploaded: string[] = [];

    let remaining = MAX_IMAGES - urls.length;
    if (remaining <= 0) {
      setUploading(false);
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    try {
      for (const file of Array.from(fileList)) {
        if (remaining <= 0) {
          setError(`Only the first ${MAX_IMAGES} images were kept.`);
          break;
        }
        if (!file.type.startsWith("image/")) {
          setError(`"${file.name}" isn't an image — skipped.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError(`"${file.name}" is over 10MB — skipped.`);
          continue;
        }
        const path = `${crypto.randomUUID()}-${safeName(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        uploaded.push(data.publicUrl);
        remaining -= 1;
      }
      if (uploaded.length > 0) update([...urls, ...uploaded]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    update(urls.filter((u) => u !== url));
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        disabled={uploading}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-background px-6 py-10 text-muted transition-colors hover:border-accent hover:bg-accent-soft disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        ) : (
          <ImagePlus className="h-8 w-8" />
        )}
        <span className="text-sm font-medium">
          {uploading ? "Uploading…" : "Click or drag images here"}
        </span>
        <span className="text-xs text-faint">PNG, JPG up to ~10MB each</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        aria-label={`Upload ${label.toLowerCase()}`}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {urls.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url) => (
            <li
              key={url}
              className="relative overflow-hidden rounded-lg border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- mixed remote hosts; img is simplest for a small preview grid */}
              <img src={url} alt="Uploaded preview" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
