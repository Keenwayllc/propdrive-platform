/**
 * Account settings — edit the signed-in agent's profile.
 */
import ProfileForm from "@/components/profile-form";
import { getMyProfile } from "@/lib/queries";

export default async function SettingsPage() {
  const profile = await getMyProfile();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>
      <ProfileForm
        initialName={profile?.full_name ?? ""}
        email={profile?.email ?? ""}
      />
    </div>
  );
}
