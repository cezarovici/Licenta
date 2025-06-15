type CompleteClientPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoUrl: string;
  bio: string;
};

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

  localStorage.setItem("userType", "client");
  return response.json();
}
