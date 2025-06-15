import type { Location, LocationCreatePayload } from "../../types/location";

const BASE_URL = "http://localhost:8080/api"; // URL-ul tău API Gateway/Core Service

// Funcție ajutătoare pentru a prelua token-ul
const getToken = (): string => {
  if (typeof window === "undefined") {
    throw new Error("Cannot access localStorage on server side.");
  }
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  return token;
};

/**
 * Prelucrează toate locațiile pentru un anumit business.
 */
export const getBusinessLocations = async (
  businessAccountId: number
): Promise<Location[]> => {
  const token = getToken();
  const url = `${BASE_URL}/business-profiles/${businessAccountId}/locations`;
  console.log(`Fetching locations from: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Asigură-te că Gateway-ul tău API setează X-User-Id
      "X-User-Id": businessAccountId.toString(), // Transmitem ID-ul utilizatorului autentificat
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to fetch locations:", response.status, errorBody);
    throw new Error(
      `Failed to fetch locations: ${response.status} - ${errorBody}`
    );
  }

  return response.json();
};

/**
 * Adaugă o nouă locație pentru un business.
 */
export const addBusinessLocation = async (
  businessAccountId: number,
  locationData: LocationCreatePayload
): Promise<Location> => {
  const token = getToken();
  const url = `${BASE_URL}/business-profiles/${businessAccountId}/locations`;
  console.log(`Adding location to: ${url} with data:`, locationData);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Id": businessAccountId.toString(), // Transmitem ID-ul utilizatorului autentificat
    },
    body: JSON.stringify(locationData),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to add location:", response.status, errorBody);
    throw new Error(
      `Failed to add location: ${response.status} - ${errorBody}`
    );
  }

  return response.json();
};

// TODO: Adaugă funcții pentru updateBusinessLocation, deleteBusinessLocation, getLocationById
