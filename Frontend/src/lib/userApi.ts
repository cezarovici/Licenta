export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
  authorities: string[];
}

/**
 * Get current user's profile
 */
export const getProfile = async (): Promise<User> => {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const response = await fetch("http://localhost:8080/idm/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
};

/**
 * Update current user's profile
 */
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await fetch("http://localhost:8080/idm/user/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const user: User = await response.json();
  return user;
};

/**
 * Delete current user's profile
 */
export const deleteProfile = async (): Promise<void> => {
  const response = await fetch("http://localhost:8080/idm/user/me", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete profile");
  }
};
