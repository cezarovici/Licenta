export type UserType = "CLIENT" | "BUSINESS" | null;

/**
 * Determină tipul de utilizator curent făcând un apel API către backend.
 * Aceasta funcție presupune că un token JWT valid este disponibil în localStorage
 * și că serverul va extrage accountId din el.
 */
export const getUserTypeFromBackend = async (): Promise<UserType> => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found for getUserTypeFromBackend.");
    return null;
  }

  try {
    const apiUrl = `http://localhost:8080/api/user-type/`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response);
      console.error(
        `Failed to fetch user type: ${response.status} - ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    const fetchedUserType = data.userType as UserType;

    if (fetchedUserType === "CLIENT" || fetchedUserType === "BUSINESS") {
      return fetchedUserType;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user type:", error);
    return null;
  }
};
