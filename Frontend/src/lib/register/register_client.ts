type CompleteClientPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePhotoUrl: string;
  bio: string;
};

/**
 * Funcție care înregistrează un cont complet de CLIENT.
 */
export async function registerClientAccount(payload: CompleteClientPayload) {
  const response = await fetch("http://localhost:8080/api/register/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "An unknown registration error occurred."
    );
  }

  return response.json();
}
