import { useState } from "react";
import { Spinner, Alert } from "flowbite-react";
import ProfileHeader from "../../../../components/profile/business/ProfileHeader";
import { useLocations } from "../../hooks/useLocation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function LocationProfilePage({
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
    allLocations,
    locationDetails: location,
    isLoading: isRefreshing,
  } = useLocations(businessId, locationId);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title={`Profil Locație: ${location!!.name}`}
        subtitle={location!!.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-2 space-y-8"></div>
        <div className="md:col-span-1 space-y-8">
          {location ? (
            <></>
          ) : (
            <div className="text-center p-8">
              <Spinner size="xl" />
            </div>
          )}

          {isRefreshing && (
            <Alert color="info" className="mt-4">
              Actualizare în curs...
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
