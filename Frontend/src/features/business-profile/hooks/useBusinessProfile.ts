import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../../types/api/fetch";
import type {
  BusinessUpdatePayload,
  PhotoCreateRequest,
} from "../../../types/api";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

export const useBusinessProfile = (businessId: number) => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const queryKey = ["get", "/api/business-profile"];
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refreshProfile,
  } = api.useQuery("get", "/api/businesses/{businessId}", {
    params: {
      path: { businessId: businessId },
    },
  });

  const invalidateAndRefresh = () => {
    queryClient.invalidateQueries({ queryKey });
    refreshProfile();
  };

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

  const { data: allBusinessPhotos } = api.useQuery(
    "get",
    "/api/businesses/{businessAccountId}/photos",
    {
      params: { path: { businessAccountId: businessId! } },
      enabled: businessId,
    }
  );

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

  const { mutate: deletePhoto, isPending: isDeletingPhoto } = api.useMutation(
    "delete",
    "/api/business-profile/photos/{photoId}",
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

  const isSubmitting = isUpdating || isUploadingPhoto || isDeletingPhoto;

  const handleUpdateProfile = (payload: BusinessUpdatePayload) => {
    updateProfile({ body: payload });
  };

  const handleUploadPhoto = (body: PhotoCreateRequest) => {
    uploadPhoto({ body: body });
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
    allBusinessPhotos,
    updateProfile: handleUpdateProfile,
    uploadPhoto: handleUploadPhoto,
    deletePhoto: handleDeletePhoto,
  };
};
