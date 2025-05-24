type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  authorities: string[];
};

export async function registerUser(payload: RegisterPayload) {
  const response = await fetch("http://localhost:8080/idm/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Eroare necunoscută la înregistrare.");
  }

  return response.json();
}
