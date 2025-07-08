import { Spinner, Alert } from "flowbite-react";

import ProfileHeader from "../../components/profile/business/ProfileHeader";
import BusinessProfileDisplay from "./components/BusinessProfileDisplay";
import DeleteProfileSection from "./components/ProfileDeleteSection";
import StatusAlert from "../../components/profile/business/StatusAlert";
import { useBusinessProfile } from "./hooks/useBusinessProfile";
import { useLocations } from "../location-management/hooks/useLocation";
import BusinessPhotosList from "./components/BusinessPhotoList";
import BusinessLocationsList from "../location-management/components/BusinessLocationsList";

export default function BusinessProfilePage({
  accountId,
}: {
  accountId: number;
}) {
  const {
    profile,
    allBusinessPhotos,
    isLoading: isProfileLoading,
    isSubmitting: isProfileSubmitting,
    statusMessage: profileStatus,
    updateProfile,
  } = useBusinessProfile(accountId);

  const { statusMessage: locationStatus, isProcessing: isLocationProcessing } =
    useLocations();

  const isLoading = isProfileLoading;
  const isSubmitting = isProfileSubmitting || isLocationProcessing;
  const statusMessage = profileStatus || locationStatus;

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4 text-heading">
          Niciun profil de business găsit.
        </h2>
        <p className="text-secondary">
          Poți crea unul sau verifică dacă ești autentificat.
        </p>
        {statusMessage && statusMessage.type === "error" && (
          <Alert color="failure" className="mt-4 max-w-sm mx-auto">
            {statusMessage.message}
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title="Profilul Tău de Business"
        subtitle="Vizualizează detaliile și gestionează locațiile."
      />
      <StatusAlert statusMessage={statusMessage} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <BusinessProfileDisplay accountId={accountId} />
          <BusinessPhotosList accountId={accountId} />
        </div>
        <div className="md:col-span-1 space-y-8">
          <BusinessLocationsList businessId={profile.id} />
          <DeleteProfileSection
            onDelete={() => {}}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
