"use client";

/**
 * Interactive listings map (Leaflet + free OpenStreetMap tiles, no API key).
 * Loaded client-only via dynamic import to avoid Leaflet's window access during
 * SSR. Plots properties that have coordinates and links each pin to its page.
 */
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  lat: number | null;
  lng: number | null;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
  );
}

export default function PropertyMap({ properties }: { properties: MapProperty[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const pts = properties.filter(
        (p): p is MapProperty & { lat: number; lng: number } =>
          p.lat != null && p.lng != null
      );

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html:
          '<div style="width:18px;height:18px;border-radius:9999px;background:#b85c38;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const markers = pts.map((p) => {
        const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
        m.bindPopup(
          `<a href="/properties/${p.id}" style="font-weight:600;color:#1a1714;text-decoration:none">${esc(
            p.title
          )}</a><br/><span style="color:#75695b">${currency.format(
            p.price
          )} · ${esc(p.city)}</span>`
        );
        return m;
      });

      if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      } else {
        map.setView([34.05, -118.42], 10); // Los Angeles
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties]);

  return (
    <div
      ref={containerRef}
      className="relative isolate z-0 h-[420px] w-full overflow-hidden rounded-[1.5rem] border border-line bg-line"
    />
  );
}
