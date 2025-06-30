import { client } from "../fetch";
import type {
  PublicBusinessResponse,
  BusinessProfileDto,
} from "../../types/business";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Gestionează erorile de rețea într-un mod standardizat.
 * @param response - Răspunsul de la fetch.
 * @param context - Un string ce descrie contextul acțiunii (ex: "fetch business profile").
 */
const handleApiError = async (response: Response, context: string) => {
  const errorBody = await response.text();
  console.error(
    `Failed to ${context}:`,
    response.status,
    response.statusText,
    errorBody
  );
  throw new Error(
    `Failed to ${context}: ${response.status} - ${errorBody || response.statusText}`
  );
};

/**
 * Obține token-ul de autentificare din localStorage.
 * Aruncă o eroare dacă token-ul nu este găsit.
 */
const getAuthToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  return token;
};

/**
 * Prelucrează profilul afacerii curente autentificate.
 * Această funcție presupune că, la login, token-ul JWT este salvat în localStorage.
 */
export const getCurrentBusinessProfile = async () => {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  console.log(token);

  if (!token) {
    throw new Error("Business is not authenticated. No token found.");
  }

  const response = await client.GET(`/api/business-profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data) {
    if (response.response.status === 404) {
      throw new Error("Business profile not found.");
    }
    throw new Error("Failed to fetch business profile.");
  }

  return response.data;
};

/**
 * Actualizează profilul de business pentru utilizatorul autentificat.
 * @param data - Datele de actualizare pentru profil.
 */
export const updateBusinessProfile = async (
  data: BusinessProfileDto
): Promise<BusinessProfileDto> => {
  // URL-ul corect, conform BusinessProfileController
  const url = `${API_BASE_URL}/business-profile/`;
  const token = getAuthToken();

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response, "update business profile");
  }

  return response.json();
};

/**
 * Șterge profilul de business pentru utilizatorul autentificat.
 */
export const deleteBusinessProfile = async (): Promise<void> => {
  // URL-ul corect, conform BusinessProfileController
  const url = `${API_BASE_URL}/business-profile/`;
  const token = getAuthToken();

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleApiError(response, "delete business profile");
  }
};

/**
 * Preia lista publică de business-uri (nu necesită autentificare).
 */
export const getAllPublicBusinesses = async (): Promise<
  PublicBusinessResponse[]
> => {
  const url = `${API_BASE_URL}/public/businesses`;
  console.log(`Fetching public businesses from: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await handleApiError(response, "fetch public businesses");
  }

  return response.json();
};
