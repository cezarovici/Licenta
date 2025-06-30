import { client } from "../fetch";
import type { components } from "../../types/api.generated";

// Importăm tipurile DTO de care avem nevoie
type LocationCreateRequest = components["schemas"]["LocationCreateRequestDTO"];
type LocationResponse = components["schemas"]["LocationResponse"];

/**
 * Creează o nouă locație pentru un business specificat.
 * @param accountId ID-ul contului de business.
 * @param locationData Datele pentru noua locație.
 * @returns Datele locației nou create.
 */
export const createLocationForBusiness = async (
  accountId: number,
  locationData: LocationCreateRequest
): Promise<LocationResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await client.POST(
    "/api/business-profiles/{businessAccountId}/locations",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          businessAccountId: accountId,
        },
      },
      body: locationData,
    }
  );

  if (response.error) {
    throw new Error(response || "Failed to create location.");
  }

  return response.data;
};
