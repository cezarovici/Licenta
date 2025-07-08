// src/features/events/hooks/useEvents.ts
import { useState, useMemo } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { api } from "../../../types/api/fetch";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

/**
 * Hook custom pentru a gestiona operațiunile legate de evenimente.
 * @param {number} [eventId] - Opțional. Dacă este furnizat, hook-ul va prelua și detaliile pentru acest eveniment.
 */
export const useEvents = (eventId?: number) => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const queryKeys = useMemo(
    () => ({
      all: ["get", "/api/events"] as QueryKey,
      details: eventId
        ? ([
            "get",
            "/api/events/{eventId}",
            { params: { path: { eventId: eventId } } },
          ] as QueryKey)
        : ([] as QueryKey),
    }),
    [eventId]
  );

  // =================================================================
  //  QUERIES - Preluarea datelor
  // =================================================================

  const { data: events, isLoading: areEventsLoading } = api.useQuery(
    "get",
    "/api/events"
  );

  const { data: eventDetails, isLoading: isDetailsLoading } = api.useQuery(
    "get",
    "/api/events/{eventId}",
    {
      params: { path: { eventId: eventId! } },
      enabled: !!eventId,
    }
  );

  // =================================================================
  //  MUTATIONS - Modificarea datelor
  // =================================================================

  const createMutationOptions = (
    successMessage: string,
    errorMessagePrefix: string
  ) => ({
    onSuccess: () => {
      setStatusMessage({ type: "success", message: successMessage });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      if (eventId) {
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

  const { mutate: createEvent, isPending: isCreating } = api.useMutation(
    "post",
    "/api/events/{eventId}/join",
    createMutationOptions("Evenimentul a fost creat!", "Eroare la creare")
  );

  return {
    // Date și stări
    allEvents: events || [],
    eventDetails,
    isLoading: areEventsLoading || isDetailsLoading,
    isProcessing: isCreating,
    statusMessage,
    setStatusMessage,

    // Acțiuni
    createEvent,
  };
};
