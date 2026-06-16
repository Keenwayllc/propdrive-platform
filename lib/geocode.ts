import "server-only";

/**
 * Server-side geocoding via Photon, the free OpenStreetMap geocoder (no API
 * key, same source as our Leaflet maps and the address autocomplete). Used as a
 * safety net so a listing always gets map coordinates even when the owner types
 * an address by hand instead of picking an autocomplete suggestion.
 */
export async function geocodeAddress(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const q = query.trim();
  if (q.length < 4) return null;

  try {
    const url =
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}` +
      `&limit=1&lang=en&lat=34.05&lon=-118.24`;
    // Don't let a slow geocoder hang the save.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      features?: { geometry?: { coordinates?: [number, number] } }[];
    };
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    // Photon returns [lon, lat].
    return { lat: coords[1], lng: coords[0] };
  } catch {
    return null;
  }
}

/** Compose a full address string from a listing's parts for geocoding. */
export function composeAddress(parts: {
  map_address?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}): string {
  if (parts.map_address?.trim()) return parts.map_address.trim();
  return [parts.address, parts.city, parts.state, parts.zip]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");
}
