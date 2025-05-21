export function getUserRoles(): string[] {
  if (typeof window === "undefined") return [];

  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.roles || [];
  } catch (e) {
    console.error("Invalid token:", e);
    return [];
  }
}

export function isAdmin(): boolean {
  return getUserRoles().includes("ROLE_ADMIN");
}
