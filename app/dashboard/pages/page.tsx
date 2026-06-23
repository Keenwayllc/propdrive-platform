/**
 * Pages — create and manage custom standalone pages (served at /p/[slug]).
 */
import PagesManager from "@/components/pages-manager";
import { getAllPages } from "@/lib/queries";

export default async function PagesAdminPage() {
  const pages = await getAllPages();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pages</h1>
        <p className="mt-1 text-sm text-muted">
          Create your own pages — services, FAQ, team, and more. Each publishes
          to <span className="font-medium text-ink">/p/your-slug</span> and can
          appear in your top menu or footer.
        </p>
      </div>
      <PagesManager initial={pages} />
    </div>
  );
}
