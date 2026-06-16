/**
 * Market Insights manager — write, edit, publish, and remove blog articles.
 */
import PostsManager from "@/components/posts-manager";
import { getAllPosts, getOpenAiKeyStatus } from "@/lib/queries";

export default async function InsightsAdminPage() {
  const [posts, ai] = await Promise.all([getAllPosts(), getOpenAiKeyStatus()]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Market Insights</h1>
        <p className="mt-1 text-sm text-muted">
          Your blog. Publishing articles drives SEO and organic leads. Changes go
          live immediately.
        </p>
      </div>
      <PostsManager initial={posts} aiConnected={ai.source !== null} />
    </div>
  );
}
