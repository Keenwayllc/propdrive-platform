"use client";

/**
 * Simple color picker used in the branding editor. Combines a native color
 * input with a hex text field so values can be typed or picked.
 */
import { useId } from "react";

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white p-1"
          aria-label={`${label} color swatch`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-32 rounded-lg border border-line px-3 py-2 text-sm uppercase focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}
