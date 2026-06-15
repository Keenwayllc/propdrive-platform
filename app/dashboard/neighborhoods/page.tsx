/**
 * Neighborhoods manager — add, edit, and remove the market areas shown across
 * the public site (homepage tiles + the Neighborhoods pages).
 */
import NeighborhoodsManager from "@/components/neighborhoods-manager";
import { getAllNeighborhoods } from "@/lib/queries";

export default async function NeighborhoodsAdminPage() {
  const neighborhoods = await getAllNeighborhoods();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Neighborhoods</h1>
        <p className="mt-1 text-sm text-muted">
          The market areas shown on your homepage and Neighborhoods pages. Add
          your own to target any region. Changes go live immediately.
        </p>
      </div>
      <NeighborhoodsManager initial={neighborhoods} />
    </div>
  );
}
