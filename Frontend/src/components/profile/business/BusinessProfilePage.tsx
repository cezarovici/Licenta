import { Spinner, Alert } from "flowbite-react";
import { useBusinessProfile } from "../../../hooks/useBusinessProfile";
import { useLocations } from "../../../hooks/useLocation";

import ProfileHeader from "./ProfileHeader";
import BusinessProfileDisplay from "./BusinessProfileDisplay";
import BusinessLocationsList from "./BusinessLocationsList";
import DeleteProfileSection from "./ProfileDeleteSection";
import StatusAlert from "./StatusAlert";
import BusinessPhotosList from "./BusinessPhotoList";
import PhotoUpload from "./PhotoUpload";

export default function BusinessProfilePage() {
  const {
    profile,
    isLoading: isProfileLoading,
    isSubmitting: isProfileSubmitting,
    statusMessage: profileStatus,
    updateProfile,
    refreshProfile,
    deletePhoto,
  } = useBusinessProfile();

  const {
    createLocation,
    statusMessage: locationStatus,
    isProcessing: isLocationProcessing,
  } = useLocations();

  const handlePhotoUploaded = () => {
    refreshProfile();
  };

  const handlePhotoDeleted = (photoId: number) => {
    deletePhoto(photoId);
  };

  const handleLocationAdded = () => {
    refreshProfile();
  };

  const handleLocationClick = (locationId: number) => {
    window.location.href = `/locations/${locationId}`;
  };

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
          <BusinessProfileDisplay
            profile={profile}
            accountId={profile.id}
            isSubmitting={isSubmitting}
            onUpdateProfile={updateProfile}
          />
          <BusinessPhotosList
            photos={profile.photos || []}
            onPhotoDeleted={handlePhotoDeleted}
          />
        </div>
        <div className="md:col-span-1 space-y-8">
          <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
          <BusinessLocationsList
            locations={profile.locations || []}
            accountId={profile.id}
            onLocationAdded={handleLocationAdded}
            createLocation={createLocation}
            isSubmitting={isLocationProcessing}
            onLocationClick={handleLocationClick}
          />
          <DeleteProfileSection
            onDelete={() => {}}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
