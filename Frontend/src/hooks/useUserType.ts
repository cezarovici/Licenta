import { useState, useEffect } from "react";
import { getUserTypeFromBackend, type UserType } from "../lib/auth/authUtils";

export const useUserType = () => {
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        setLoading(true);
        setError("");

        const type = await getUserTypeFromBackend();
        setUserType(type);
      } catch (err) {
        console.error("Error fetching user type:", err);
        setError("Could not determine user type. Please try again.");
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, []);

  return { userType, loading, error };
};
