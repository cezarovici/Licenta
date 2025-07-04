import { Spinner, Alert } from "flowbite-react";

import ProfileHeader from "../profile/business/ProfileHeader";
import LocationCustomizationPage from "../profile/business/LocationCustomizationPage";
import { useLocations } from "../../hooks/useLocation";

export default function LocationProfilePage({
  locationId,
}: {
  locationId: number;
}) {
  const {
    allLocations,
    locationDetails,
    isLoading,
    isProcessing,
    statusMessage,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocations(locationId);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Alert color="failure">
          Eroare: Nu am putut încărca detaliile pentru locația specificată.
        </Alert>
      </div>
    );
  }

  const handleSaveChanges = (updatedData: any) => {
    updateLocation({
      params: {
        path: {
          locationId: locationId,
          businessAccountId: locationDetails!.id,
        },
      },
      body: updatedData,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title={`Editezi: ${locationDetails!.name}`}
        subtitle="Modifică detaliile, programul și facilitățile locației tale."
      />

      {statusMessage && (
        <Alert
          color={statusMessage.type === "success" ? "success" : "failure"}
          className="my-4"
        >
          {statusMessage.message}
        </Alert>
      )}

      {/* Componenta de formular primește datele și funcția de salvare */}
      <LocationCustomizationPage
        location={locationDetails}
        onSave={handleSaveChanges}
        isSaving={isProcessing}
      />
    </div>
  );
}
