import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { BusinessUpdatePayload } from "../types/api";
import { api } from "../types/api/fetch";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

export const useBusinessProfile = () => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  // 1. HOOK PENTRU PRELUAREA DATELOR (QUERY)
  // ---------------------------------------------
  const queryKey = ["get", "/api/business-profile"];
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refreshProfile,
  } = api.useQuery("get", "/api/business-profile");

  const invalidateAndRefresh = () => {
    queryClient.invalidateQueries({ queryKey });
    refreshProfile();
  };

  // 2. HOOK-URI PENTRU MODIFICAREA DATELOR (MUTATIONS)
  // ----------------------------------------------------

  // Mutație pentru actualizarea detaliilor profilului
  const { mutate: updateProfile, isPending: isUpdating } = api.useMutation(
    "patch",
    "/api/business-profile",

    {
      onSuccess: () => {
        setStatusMessage({
          type: "success",
          message: "Profilul a fost actualizat cu succes!",
        });
        invalidateAndRefresh();
      },
      onError: (error: any) => {
        setStatusMessage({
          type: "error",
          message: `Eroare: ${error.message}`,
        });
      },
    }
  );

  // Mutație pentru încărcarea unei noi poze
  const { mutate: uploadPhoto, isPending: isUploadingPhoto } = api.useMutation(
    "post",
    "/api/business-profile/photos",
    {
      onSuccess: () => {
        setStatusMessage({
          type: "success",
          message: "Poza a fost încărcată!",
        });
        invalidateAndRefresh();
      },
      onError: (error: any) => {
        setStatusMessage({
          type: "error",
          message: `Eroare la upload: ${error.message}`,
        });
      },
    }
  );

  // Mutație pentru ștergerea unei poze
  const { mutate: deletePhoto, isPending: isDeletingPhoto } = api.useMutation(
    "delete",
    "/api/business-profile/photos/{photoId}", // Path-ul conține un parametru
    {
      onSuccess: () => {
        setStatusMessage({ type: "success", message: "Poza a fost ștearsă." });
        invalidateAndRefresh();
      },
      onError: (error: any) => {
        setStatusMessage({
          type: "error",
          message: `Eroare la ștergere: ${error.message}`,
        });
      },
    }
  );

  // 3. LOGICA COMBINATĂ ȘI VALOAREA RETURNATĂ
  // -----------------------------------------------

  // Combinăm toate stările `isPending` într-una singură
  const isSubmitting = isUpdating || isUploadingPhoto || isDeletingPhoto;

  // Expunem funcții curate către componentă
  const handleUpdateProfile = (payload: BusinessUpdatePayload) => {
    updateProfile({ body: payload });
  };

  const handleUploadPhoto = (body: { url: string; description?: string }) => {
    uploadPhoto(body);
  };

  const handleDeletePhoto = (photoId: number) => {
    deletePhoto({ params: { path: { photoId } } });
  };

  return {
    profile,
    isLoading: isProfileLoading,
    isSubmitting,
    statusMessage,
    refreshProfile,
    updateProfile: handleUpdateProfile,
    uploadPhoto: handleUploadPhoto,
    deletePhoto: handleDeletePhoto,
  };
};
