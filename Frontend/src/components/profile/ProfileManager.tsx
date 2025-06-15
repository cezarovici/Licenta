import React, { useState, useEffect } from "react";
import {
  getUserTypeFromBackend,
  type UserType,
} from "../../lib/auth/authUtils";
import ProfilePlaceholder from "./ProfilePlaceholder";
import ClientProfileCard from "./client/ClientProfileCard";
import BusinessProfileCard from "./business/BusinessProfileCards";

export default function ProfileManager() {
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [loadingType, setLoadingType] = useState<boolean>(true);
  const [errorType, setErrorType] = useState<string>(""); // Adăugăm o stare pentru erori

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        setLoadingType(true);
        setErrorType("");

        const type = await getUserTypeFromBackend();
        setUserType(type);
      } catch (err) {
        console.error("Error fetching user type:", err);
        setErrorType("Could not determine user type. Please try again.");
        setUserType(null);
      } finally {
        setLoadingType(false);
      }
    };

    fetchUserType(); // Apelăm funcția asincronă
  }, []); // Array de dependențe gol, se rulează o singură dată la montare

  // Afișăm placeholder-ul pentru stările de încărcare și eroare
  if (loadingType) {
    return <ProfilePlaceholder loading={true} error="" />;
  }

  // Dacă a existat o eroare la preluarea tipului sau tipul este necunoscut/neautentificat
  if (errorType || userType === null) {
    return (
      <ProfilePlaceholder
        loading={false}
        error={errorType || "User type not identified or not authenticated."}
      />
    );
  }

  // Odată ce userType este determinat și nu sunt erori, randăm componenta corespunzătoare
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {userType === "CLIENT" && <ClientProfileCard />}
      {userType === "BUSINESS" && <BusinessProfileCard />}
    </div>
  );
}
