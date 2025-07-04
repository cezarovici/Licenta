/**
 * Interfața care corespunde cu ClientProfileDTO din backend.
 * Reprezintă datele profilului unui client.
 */
export interface ClientProfile {
  accountId: number;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
  bio: string | null;
}

/**
 * Prelucrează profilul utilizatorului curent autentificat.
 * Această funcție presupune că, la login, atât token-ul JWT, cât și ID-ul contului
 * sunt salvate în localStorage.
 */
export const getCurrentUserProfile = async (): Promise<ClientProfile> => {
  // Verificăm dacă suntem în contextul browser-ului
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server side");
  }

  // Preluăm token-ul pentru autorizare
  const token = localStorage.getItem("token");
  // Preluăm ID-ul contului pentru a construi URL-ul

  if (!token) {
    throw new Error("User is not authenticated. No token found.");
  }

  // Construim URL-ul către noul endpoint din `core-functionality`,
  // care este expus prin API Gateway pe portul 8080.
  const apiUrl = `http://localhost:8080/api/client-profile/`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      // Antetul de autorizare este încă necesar, deoarece cererea trece prin API Gateway,
      // care probabil securizează rutele.
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Dacă primim 404, aruncăm o eroare specifică. Altfel, una generică.
    if (response.status === 404) {
      throw new Error("User profile not found.");
    }
    throw new Error("Failed to fetch user profile.");
  }

  // Returnăm datele de profil parsate ca JSON.
  return await response.json();
};
