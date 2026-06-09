"use client";

/**
 * Image upload placeholder. Phase 1 provides a drag-and-drop UI and local
 * previews only — the actual upload to Supabase Storage is wired in Phase 2.
 */
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export interface ImageUploadProps {
  label?: string;
  /** Emits the selected File objects so the parent can upload them later. */
  onFilesSelected?: (files: File[]) => void;
}

interface Preview {
  url: string;
  name: string;
}

export default function ImageUpload({
  label = "Images",
  onFilesSelected,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    const next = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPreviews((prev) => [...prev, ...next]);
    onFilesSelected?.(files);
  }

  function remove(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-background px-6 py-10 text-muted transition-colors hover:border-accent hover:bg-accent-soft"
      >
        <ImagePlus className="h-8 w-8" />
        <span className="text-sm font-medium">Click or drag images here</span>
        <span className="text-xs text-faint">PNG, JPG up to 10MB each</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previews.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((p, i) => (
            <li key={p.url} className="relative overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote asset */}
              <img src={p.url} alt={p.name} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${p.name}`}
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
