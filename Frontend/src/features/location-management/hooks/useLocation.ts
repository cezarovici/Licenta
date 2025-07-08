import { useState, useMemo } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { api } from "../../../types/api/fetch";
import { useUserType } from "../../../hooks/useUserType";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

/**
 * Hook custom pentru a gestiona operațiunile legate de locații.
 * Încorporează preluarea de date, managementul stării server-ului și acțiunile de modificare.
 * @param {number} [businessAccountId] - ID-ul contului de afaceri, necesar pentru operațiunile de administrare.
 * @param {number} [locationId] - Opțional. Dacă este furnizat, hook-ul va prelua și detaliile pentru această locație.
 */
export const useLocations = (
  businessAccountId?: number,
  locationId?: number
) => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const queryKeys = useMemo(
    () => ({
      all: ["get", "/api/locations"] as QueryKey,
      details: locationId
        ? ([
            "get",
            "/api/locations/{id}",
            { params: { path: { id: locationId } } },
          ] as QueryKey)
        : ([] as QueryKey),
    }),
    [locationId]
  );

  // =================================================================
  //  2. QUERIES - Preluarea datelor
  // =================================================================

  const { data: locations, isLoading: areLocationsLoading } = api.useQuery(
    "get",
    "/api/locations"
  );

  const { data: locationDetails, isLoading: isDetailsLoading } = api.useQuery(
    "get",
    "/api/locations/{locationId}",
    {
      params: { path: { locationId: locationId! } },
      enabled: !!locationId,
    }
  );

  const { data: operatingHours, isLoading: isLoadingOperatingHours } =
    api.useQuery(
      "get",
      "/api/locations/{locationId}/business/{businessId}/operating-hours",
      {
        params: {
          path: {
            locationId: locationId!,
            businessId: businessAccountId!,
          },
        },
        enabled: !!locationId && !!businessAccountId,
      }
    );

  const { data: facilities, isLoading: isLoadingFacilities } = api.useQuery(
    "get",
    "/api/locations/{locationId}/business/{businessId}/facilities",
    {
      params: {
        path: {
          locationId: locationId!,
          businessId: businessAccountId!,
        },
      },
      enabled: !!locationId && !!businessAccountId,
    }
  );

  const { data: sportConfiguration, isLoading: isLoadingSportConfiguration } =
    api.useQuery(
      "get",
      "/api/locations/{locationId}/business/{businessId}/sport-configurations",
      {
        params: {
          path: {
            locationId: locationId!,
            businessId: businessAccountId!,
          },
        },
        enabled: !!locationId && !!businessAccountId,
      }
    );

  // =================================================================
  //  3. MUTATIONS - Modificarea datelor
  // =================================================================

  const createMutationOptions = (
    successMessage: string,
    errorMessagePrefix: string
  ) => ({
    onSuccess: () => {
      setStatusMessage({ type: "success", message: successMessage });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      if (locationId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.details });
      }
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        message: `${errorMessagePrefix}: ${error.message}`,
      });
    },
  });

  const { mutate: createLocation, isPending: isCreating } = api.useMutation(
    "post",
    "/api/business-profiles/{businessAccountId}/locations",
    createMutationOptions("Locația a fost creată!", "Eroare la creare")
  );
  const { mutate: updateLocation, isPending: isUpdating } = api.useMutation(
    "patch",
    "/api/business-profiles/{businessAccountId}/locations/{locationId}",
    createMutationOptions(
      "Detaliile de bază au fost actualizate.",
      "Eroare la actualizarea detaliilor"
    )
  );

  const { mutate: updateOperatingHours, isPending: isUpdatingHours } =
    api.useMutation(
      "put",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/operating-hours",
      createMutationOptions(
        "Programul a fost actualizat.",
        "Eroare la actualizarea programului"
      )
    );
  const { mutate: updateFacilities, isPending: isUpdatingFacilities } =
    api.useMutation(
      "put",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/facilities",
      createMutationOptions(
        "Facilitățile au fost actualizate.",
        "Eroare la actualizarea facilităților"
      )
    );
  const { mutate: addPhoto, isPending: isAddingPhoto } = api.useMutation(
    "post",
    "/api/business-profiles/{businessAccountId}/locations/{locationId}/photos",
    createMutationOptions(
      "Fotografia a fost adăugată.",
      "Eroare la adăugarea fotografiei"
    )
  );

  const { mutate: deletePhoto, isPending: isDeletingPhoto } = api.useMutation(
    "delete",
    "/api/business-profiles/{businessAccountId}/locations/{locationId}/photos/{photoId}",
    createMutationOptions(
      "Fotografia a fost ștearsă.",
      "Eroare la ștergerea fotografiei"
    )
  );

  const { mutate: deleteLocation, isPending: isDeletingLocation } =
    api.useMutation(
      "delete",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}",
      createMutationOptions(
        "Locație ștearsă cu succes",
        "Eroare la stergerea unei locații"
      )
    );

  const { mutate: addPricingRule, isPending: isAddingPricingRule } =
    api.useMutation(
      "post",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/pricing-rules",
      createMutationOptions(
        "Regula de preț a fost adăugată.",
        "Eroare la adăugarea regulii de preț"
      )
    );

  const { mutate: deletePricingRule, isPending: isDeletingPricingRule } =
    api.useMutation(
      "delete",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/pricing-rules/{ruleId}",
      createMutationOptions(
        "Regula de preț a fost ștearsă.",
        "Eroare la ștergerea regulii de preț"
      )
    );

  const { mutate: addSportConfiguration, isPending: isAddingSportConfig } =
    api.useMutation(
      "post",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/sport-configurations",
      createMutationOptions(
        "Configurația sportivă a fost adăugată.",
        "Eroare la adăugarea configurației"
      )
    );

  const { mutate: deleteSportConfiguration, isPending: isDeletingSportConfig } =
    api.useMutation(
      "delete",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/sport-configurations/{configId}",
      createMutationOptions(
        "Configurația sportivă a fost ștearsă.",
        "Eroare la ștergerea configurației"
      )
    );

  const { mutate: updateBookingRules, isPending: isUpdatingBookingRules } =
    api.useMutation(
      "put",
      "/api/business-profiles/{businessAccountId}/locations/{locationId}/config/booking-rules",
      createMutationOptions(
        "Regulile de rezervare au fost actualizate.",
        "Eroare la actualizarea regulilor"
      )
    );

  return {
    allLocations: locations || [],
    locationDetails,
    operatingHours,
    facilities,
    sportConfiguration,
    isLoading: areLocationsLoading || isDetailsLoading,
    isProcessing:
      isCreating ||
      isUpdating ||
      isUpdatingHours ||
      isUpdatingFacilities ||
      isAddingPhoto ||
      isDeletingPhoto ||
      isAddingPricingRule ||
      isDeletingPricingRule ||
      isAddingSportConfig ||
      isDeletingSportConfig ||
      isDeletingLocation ||
      isLoadingOperatingHours ||
      isUpdatingBookingRules ||
      isLoadingFacilities ||
      isLoadingSportConfiguration,
    statusMessage,
    setStatusMessage,

    // Acțiuni
    createLocation,
    updateLocation,
    updateOperatingHours,
    updateFacilities,
    addPhoto,
    deletePhoto,
    deleteLocation,
    addPricingRule,
    deletePricingRule,
    addSportConfiguration,
    deleteSportConfiguration,
    updateBookingRules,
  };
};
