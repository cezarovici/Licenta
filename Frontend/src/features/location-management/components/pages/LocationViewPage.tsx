import { Spinner, Alert } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfileHeader from "../../../../components/profile/business/ProfileHeader";
import LocationPhotoGallery from "../LocationPhotoGalery";
import LocationCustomizationForm from "./LocationCustomizationPage";
import { useLocations } from "../../hooks/useLocation";
import type { LocationDetails } from "../../../../types/api";

const queryClient = new QueryClient();

export default function LocationViewPage({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProfilePageRaw locationId={locationId} businessId={businessId} />
    </QueryClientProvider>
  );
}

function LocationProfilePageRaw({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
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
  } = useLocations(businessId, locationId);

  console.log(locationDetails, locationId, businessId);

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
        facilityIds: updatedData.facilities.filter((id) => id !== undefined),
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
          locationId={locationId}
          businessId={businessId}
        />
      </div>
    </div>
  );
}
