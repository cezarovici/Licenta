import { useState, useMemo } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { api } from "../../../types/api/fetch";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

/**
 * Hook custom pentru a gestiona datele profilului unui client.
 * @param {number | undefined} clientId - ID-ul clientului. Hook-ul este activ doar dacă acest ID este furnizat.
 */
export const useClientProfile = (clientId?: number) => {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  // =================================================================
  //  1. CHEI DE QUERY (QUERY KEYS)
  // =================================================================
  const queryKeys = useMemo(
    () => ({
      profile: [
        "get",
        "/api/client-profile/{clientId}/",
        { params: { path: { clientId: clientId! } } },
      ] as QueryKey,
    }),
    [clientId]
  );

  // =================================================================
  //  2. QUERIES - Preluarea datelor
  // =================================================================
  const {
    data: clientProfile,
    isLoading,
    isError,
  } = api.useQuery("get", "/api/client-profile/{clientId}/", {
    params: { path: { clientId: clientId! } },
    enabled: !!clientId,
  });

  // =================================================================
  //  3. MUTATIONS - Modificarea datelor
  // =================================================================

  // Funcție generică pentru a gestiona răspunsurile de la server
  const createMutationOptions = (
    successMessage: string,
    errorMessagePrefix: string
  ) => ({
    onSuccess: () => {
      setStatusMessage({ type: "success", message: successMessage });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        message: `${errorMessagePrefix}: ${error.message}`,
      });
    },
  });

  // --- MUTATION pentru actualizarea datelor (PATCH) ---
  const { mutate: updateProfile, isPending: isUpdating } = api.useMutation(
    "patch",
    "/api/client-profile/{clientId}/",
    // Pur și simplu folosește opțiunile generate, fără a le suprascrie.
    // Acum se va folosi invalidarea specifică și mesajul corect.
    createMutationOptions(
      "Profil actualizat cu succes!",
      "Eroare la actualizarea profilului"
    )
  );

  // --- MUTATION pentru ștergerea profilului (DELETE) ---
  const { mutate: deleteProfile, isPending: isDeleting } = api.useMutation(
    "delete",
    "/api/client-profile/{clientId}/",
    {
      ...createMutationOptions(
        "Contul a fost șters.",
        "Eroare la ștergerea contului"
      ),
      onSuccess: () => {
        setStatusMessage({ type: "success", message: "Contul a fost șters." });
        // Invalidează toate query-urile care încep cu 'client-profile' după ștergere
        queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      },
    }
  );

  // =================================================================
  //  4. FAȚADA - Valoarea returnată expusă componentelor
  // =================================================================
  return {
    // Date și stări
    clientProfile,
    isLoading,
    isError,
    isProcessing: isUpdating || isDeleting,
    statusMessage,
    setStatusMessage,

    // Acțiuni
    updateProfile,
    deleteProfile,
  };
};
