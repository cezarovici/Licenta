import ProfilePlaceholder from "../ProfilePlaceholder";
import ProfileHeader from "../business/ProfileHeader";
import ClientProfileDisplay from "./ClientProfileDisplay";
import { useClientProfile } from "../../../features/client-profile/hooks/useClientProfile";

export default function ClientProfileCard({
  accountId,
}: {
  accountId: number;
}) {
  const {
    clientProfile: profile,
    isProcessing: isProcessing,
    isLoading: loading,
    isError: loadingProfileError,
  } = useClientProfile(accountId);

  console.log("ClientProfileCard", profile, loading);

  if (loading || !profile) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ProfileHeader
          title="Profilul Tău"
          subtitle="Vezi și editează detaliile contului tău."
        />
        <ProfilePlaceholder loading={loading} error={""} />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ProfileHeader
          title="Profilul Tău"
          subtitle="Vezi și editează detaliile contului tău."
        />
        {loadingProfileError && (
          <div className="text-center p-4">
            <p className="text-red-500">
              Eroare la încărcarea profilului. Te rugăm să încerci mai târziu.
            </p>
          </div>
        )}
        <ClientProfileDisplay profile={profile} isSubmitting={loading} />
        {/* <ClientSettingsSection />
        <EditClientProfileModal /> */}
      </div>
    </>
  );
}
