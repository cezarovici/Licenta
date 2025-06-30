export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8080/idm/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "A apărut o eroare necunoscută.");
  }

  return response.json();
}
