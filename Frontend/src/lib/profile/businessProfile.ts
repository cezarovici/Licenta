export interface BusinessProfile {
  accountId: number;
  companyName: string;
  registrationNumber: string;
  businessDescription: string;
  contactEmail: string;
  phoneNumber: string;
  photoUrl: string;
}

/**
 * Prelucrează profilul afacerii curente autentificate.
 * Această funcție presupune că, la login, token-ul JWT este salvat în localStorage.
 */
export const getCurrentBusinessProfile = async (): Promise<BusinessProfile> => {
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

  // Construim URL-ul către noul endpoint pentru profilurile de afaceri.
  // Presupunem că acest endpoint este similar cu cel pentru clienți,
  // dar adaptat pentru afaceri, de exemplu, `/api/businesses/me`.
  const apiUrl = `http://localhost:8080/api/business-profile/me`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Business profile not found.");
    }
    throw new Error("Failed to fetch business profile.");
  }

  return await response.json();
};
