import { client } from "../fetch";

/**
 * Prelucrează profilul afacerii curente autentificate.
 * Această funcție presupune că, la login, token-ul JWT este salvat în localStorage.
 */
export const getCurrentBusinessProfile = async () => {
  // Verificăm dacă suntem în contextul browser-ului
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server side");
  }

  // Preluăm token-ul pentru autorizare
  const token = localStorage.getItem("token");

  console.log(token); // Pentru depanare

  if (!token) {
    throw new Error("Business is not authenticated. No token found.");
  }

  const response = await client.GET("/api/business-profile/", {
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
