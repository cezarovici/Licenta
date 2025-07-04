/**
 * Gestionează erorile de rețea într-un mod standardizat.
 * @param response - Răspunsul de la fetch.
 * @param context - Un string ce descrie contextul acțiunii (ex: "fetch business profile").
 */
export const handleApiError = async (response: Response, context: string) => {
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
export const getAuthToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  return token;
};
