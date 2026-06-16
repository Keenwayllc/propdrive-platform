/**
 * Website editor — edit the public site's marketing copy (site_settings).
 */
import SiteSettingsForm from "@/components/site-settings-form";
import { getSiteSettings, getOpenAiKeyStatus } from "@/lib/queries";

export default async function WebsiteEditorPage() {
  const [settings, ai] = await Promise.all([
    getSiteSettings(),
    getOpenAiKeyStatus(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Website Editor</h1>
        <p className="mt-1 text-sm text-muted">
          Edit the copy that appears across your public website. Changes go live
          immediately.
        </p>
      </div>
      <SiteSettingsForm initial={settings} aiConnected={ai.source !== null} />
    </div>
  );
}
