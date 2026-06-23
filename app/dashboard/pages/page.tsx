/**
 * Pages — the single hub for editing every page on the site. Built-in pages
 * (Home / About / Contact) plus owner-created custom pages, chosen from one
 * dropdown. Replaces the old standalone Website Editor.
 */
import PagesHub from "@/components/pages-hub";
import { getSiteSettings, getAllPages, getOpenAiKeyStatus } from "@/lib/queries";

export default async function PagesAdminPage() {
  const [settings, pages, ai] = await Promise.all([
    getSiteSettings(),
    getAllPages(),
    getOpenAiKeyStatus(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pages</h1>
        <p className="mt-1 text-sm text-muted">
          Edit any page on your site from one place. Pick a page below, make your
          changes, and save. Changes go live immediately.
        </p>
      </div>
      <PagesHub settings={settings} aiConnected={ai.source !== null} pages={pages} />
    </div>
  );
}
