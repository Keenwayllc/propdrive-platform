/** Hidden in the simplified build. Kept in the repo; route redirects home. */
import { redirect } from "next/navigation";

export default function InsightsPage() {
  redirect("/");
}
