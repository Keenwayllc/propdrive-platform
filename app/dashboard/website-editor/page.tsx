/** Website Editor folded into the Pages hub. Redirect for any old links. */
import { redirect } from "next/navigation";

export default function WebsiteEditorPage() {
  redirect("/dashboard/pages");
}
