import { useState, useMemo } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { api } from "../types/api/fetch";
type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

/**
 * Hook custom pentru a gestiona operațiunile legate de locații.
 * Încorporează preluarea de date, managementul stării server-ului și acțiunile de modificare.
 * @param locationId - Opțional. Dacă este furnizat, hook-ul va prelua și detaliile pentru această locație.
 */
export const useLocations = (locationId?: number) => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  // =================================================================
  //  1. CHEI DE QUERY (QUERY KEYS) - Sursa unică de adevăr
  // =================================================================
  // ✨ Refactorizare: Am folosit `useMemo` pentru a ne asigura că aceste chei nu sunt recalculate la fiecare render,
  //    deși în practică impactul este mic, este o optimizare curată.
  // ✨ Corectură: Am ajustat ordinea parametrilor la (path, method) pentru a respecta documentația.
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
  //  2. QUERIES - Preluarea datelor de pe server
  // =================================================================
  const { data: locations, isLoading: areLocationsLoading } = api.useQuery(
    "get",
    "/api/locations"
  );

  const { data: locationDetails, isLoading: isDetailsLoading } = api.useQuery(
    "get",
    "/api/locations/{id}",
    {
      params: { path: { id: locationId! } },
      // `enabled` este esențial pentru query-uri dependente. Se asigură
      // că cererea se face doar când avem un ID valid.
      enabled: !!locationId,
    }
  );

  // =================================================================
  //  3. MUTATIONS - Modificarea datelor de pe server
  // =================================================================
  // ✨ Refactorizare: Am creat o funcție generică pentru callback-uri
  //    pentru a reduce repetiția și a centraliza logica de invalidare.
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
      "Locația a fost actualizată.",
      "Eroare la actualizare"
    )
  );

  const { mutate: deleteLocation, isPending: isDeleting } = api.useMutation(
    "delete",
    "/api/business-profiles/{businessAccountId}/locations/{locationId}",
    createMutationOptions("Locația a fost ștearsă.", "Eroare la ștergere")
  );

  // =================================================================
  //  4. VALOAREA RETURNATĂ - Fațada expusă componentelor UI
  // =================================================================
  return {
    allLocations: locations || [],
    locationDetails,
    isLoading: areLocationsLoading || isDetailsLoading,
    isProcessing: isCreating || isUpdating || isDeleting,
    statusMessage,
    createLocation,
    updateLocation,
    deleteLocation,
  };
};
