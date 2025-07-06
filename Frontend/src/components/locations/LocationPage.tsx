import { Spinner, Alert } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfileHeader from "../profile/business/ProfileHeader";
import type { LocationDetails } from "../../types/api";
import LocationPhotoGallery from "../../features/location-management/components/LocationPhotoGalery";
import LocationCustomizationForm from "../../features/location-management/components/pages/LocationCustomizationPage";
import { useLocations } from "../../features/location-management/hooks/useLocation";

const queryClient = new QueryClient();

export default function LocationProfilePage({
  locationId,
}: {
  locationId: number | undefined;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProfilePageRaw locationId={locationId} />
    </QueryClientProvider>
  );
}

function LocationProfilePageRaw({
  locationId,
}: {
  locationId: number | undefined;
}) {
  const {
    locationDetails,
    isLoading,
    isProcessing,
    statusMessage,
    updateLocation,
    updateOperatingHours,
    updateFacilities,
    addPricingRule,
    addSportConfiguration,
    updateBookingRules,
  } = useLocations(undefined, locationId);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!locationDetails) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Alert color="failure">
          Eroare: Nu am putut încărca detaliile pentru locația specificată.
        </Alert>
      </div>
    );
  }

  const handleSaveChanges = (updatedData: LocationDetails) => {
    console.log("Salvare date complete:", updatedData);
    const businessId = locationDetails.business.id;

    updateLocation({
      params: {
        path: { locationId: locationId!, businessAccountId: businessId },
      },
      body: { name: updatedData.name, address: updatedData.address },
    });

    updateOperatingHours({
      params: {
        path: { locationId: locationId!, businessAccountId: businessId },
      },
      body: { hours: updatedData.operatingHours },
    });

    updateFacilities({
      params: {
        path: { locationId: locationId!, businessAccountId: businessId },
      },
      body: {
        facilityIds: updatedData.facilities
          .map((f) => f.id!)
          .filter((id) => id !== undefined),
      },
    });

    updatedData.pricingRules.forEach((rule) => {
      if (!rule.id) {
        addPricingRule({
          params: {
            path: { locationId: locationId!, businessAccountId: businessId },
          },
          body: rule,
        });
      }
    });

    updatedData.sportConfigurations.forEach((config) => {
      if (!config.id) {
        addSportConfiguration({
          params: {
            path: { locationId: locationId!, businessAccountId: businessId },
          },
          body: config,
        });
      }
    });

    // 6. Actualizare reguli de rezervare
    updateBookingRules({
      params: {
        path: { locationId: locationId!, businessAccountId: businessId },
      },
      body: {
        ...updatedData.bookingRules,
        maxBookingAdvanceDays:
          updatedData.bookingRules.maxBookingAdvanceDays ?? 0,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title={`Editezi: ${locationDetails.name}`}
        subtitle="Modifică detaliile, programul, facilitățile și regulile locației tale."
      />

      {statusMessage && (
        <Alert
          color={statusMessage.type === "success" ? "success" : "failure"}
          className="my-4"
        >
          {statusMessage.message}
        </Alert>
      )}

      <LocationPhotoGallery location={locationDetails} />

      <div className="mt-8">
        <LocationCustomizationForm
          location={locationDetails}
          onSave={handleSaveChanges}
          isSaving={isProcessing}
        />
      </div>
    </div>
  );
}
