/**
 * Banners manager — the rotating hero slides shown at the top of the homepage.
 */
import BannersManager from "@/components/banners-manager";
import { getAllBanners, getOpenAiKeyStatus } from "@/lib/queries";

export default async function BannersPage() {
  const [banners, ai] = await Promise.all([
    getAllBanners(),
    getOpenAiKeyStatus(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Homepage banners</h1>
        <p className="mt-1 text-sm text-muted">
          The rotating slides at the top of your homepage. Changes go live
          immediately.
        </p>
      </div>
      <BannersManager initial={banners} aiConnected={ai.source !== null} />
    </div>
  );
}
