"use client";

/**
 * Address autocomplete input. Type-ahead suggestions come from Photon, the free
 * OpenStreetMap geocoder (no API key, same data source as our Leaflet maps), so
 * it works out of the box for every customer with zero setup. Selecting a result
 * fills the formatted address and returns the structured parts plus coordinates,
 * which callers can use to populate city/state/zip and the map pin.
 */
import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export interface AddressParts {
  /** Full one-line formatted address. */
  label: string;
  line1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  lat: number | null;
  lng: number | null;
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: Record<string, string | undefined>;
}

function toParts(f: PhotonFeature): AddressParts {
  const p = f.properties ?? {};
  const line1 = [p.housenumber, p.street || p.name].filter(Boolean).join(" ").trim();
  const city = p.city || p.town || p.village || p.district || p.county || "";
  const coords = f.geometry?.coordinates;
  const label = [line1 || p.name, city, [p.state, p.postcode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return {
    label,
    line1: line1 || p.name || "",
    city,
    state: p.state || "",
    postcode: p.postcode || "",
    country: p.country || "",
    lat: coords ? coords[1] : null,
    lng: coords ? coords[0] : null,
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className = "form-input",
  id,
  name,
  required,
  onBlur,
  ariaLabel,
  formatSelection,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Called with the structured address when the user picks a suggestion. */
  onSelect?: (parts: AddressParts) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  onBlur?: () => void;
  ariaLabel?: string;
  /** Override the text written into the field when a suggestion is picked.
   *  Defaults to the full formatted address. */
  formatSelection?: (parts: AddressParts) => string;
}) {
  const [results, setResults] = useState<AddressParts[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(-1);
  // Don't re-search the text we just inserted from a chosen suggestion.
  const justPicked = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Debounced lookup against Photon, biased toward the Los Angeles area.
  useEffect(() => {
    if (justPicked.current) {
      justPicked.current = false;
      return;
    }
    const q = value.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (q.length < 4) {
        setResults([]);
        setOpen(false);
        return;
      }
      setBusy(true);
      try {
        const url =
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}` +
          `&limit=5&lang=en&lat=34.05&lon=-118.24`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("geocode failed");
        const data = (await res.json()) as { features?: PhotonFeature[] };
        const parts = (data.features ?? [])
          .map(toParts)
          .filter((p) => p.label);
        setResults(parts);
        setOpen(parts.length > 0);
        setActive(-1);
      } catch {
        // Network/abort — just hide suggestions, typing still works.
        setResults([]);
        setOpen(false);
      } finally {
        setBusy(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  // Close when clicking outside.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(parts: AddressParts) {
    justPicked.current = true;
    onChange(formatSelection ? formatSelection(parts) : parts.label);
    onSelect?.(parts);
    setOpen(false);
    setResults([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        name={name}
        required={required}
        aria-label={ariaLabel}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
      />
      {busy && (
        <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-faint" />
      )}
      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-xl"
        >
          {results.map((r, i) => (
            <li key={`${r.label}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  // mousedown beats the input's blur so the pick registers
                  e.preventDefault();
                  pick(r);
                }}
                className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm ${
                  i === active ? "bg-accent-soft text-ink" : "text-muted hover:bg-surface"
                }`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="leading-snug">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
