import type { User } from "../profile/clientProfile";

export async function listUsers(): Promise<User[]> {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/idm/admin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
}
