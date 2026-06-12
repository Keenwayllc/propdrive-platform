/**
 * Account settings — profile, login email, password, and session controls
 * for the signed-in agent.
 */
import ProfileForm from "@/components/profile-form";
import {
  EmailForm,
  PasswordForm,
  SecurityForm,
} from "@/components/account-security-forms";
import { getMyProfile } from "@/lib/queries";

export default async function SettingsPage() {
  const profile = await getMyProfile();
  const email = profile?.email ?? "";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account, login details, and security.
        </p>
      </div>

      <ProfileForm initialName={profile?.full_name ?? ""} />
      <EmailForm currentEmail={email} />
      <PasswordForm />
      <SecurityForm />
    </div>
  );
}
