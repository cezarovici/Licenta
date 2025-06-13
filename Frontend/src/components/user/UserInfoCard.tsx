import { useEffect, useState } from "react";
// 1. Importăm noua funcție și noua interfață din fișierul API actualizat
import { getCurrentUserProfile, type ClientProfile } from "../../lib/userApi";

export default function UserProfile() {
  // 2. Folosim noua interfață `ClientProfile` și redenumim state-ul pentru claritate
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 3. Apelăm noua funcție API pentru a prelua datele
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (err) {
        // Afișăm un mesaj de eroare mai specific, dacă este posibil
        setError(
          err instanceof Error ? err.message : "Error fetching user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // [] asigură că useEffect se execută o singură dată, la montarea componentei

  // Funcția `handleFieldSave` a fost eliminată.

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {loading && (
          <div className="p-10 text-center">
            <p className="text-xl text-gray-500 animate-pulse">
              Loading Profile...
            </p>
          </div>
        )}

        {error && (
          <div className="p-10 text-center bg-red-50">
            <p className="text-xl text-red-600">Could not load profile</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <div>
            {/* 4. O secțiune de "header" pentru profil, cu o imagine de fundal tematică */}
            <div className="h-32 bg-indigo-500 bg-gradient-to-r from-purple-500 to-indigo-600" />

            <div className="p-8 -mt-20">
              <div className="flex flex-col items-center">
                {/* 5. Afișăm poza de profil reală */}
                <img
                  src={profile.profilePhotoUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                />

                {/* 6. Afișăm numele complet, mai proeminent */}
                <h1 className="text-3xl font-bold text-gray-800 mt-4">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-sm text-gray-500">
                  Member ID: {profile.accountId}
                </p>
              </div>

              {/* 7. Secțiune dedicată pentru "Bio" */}
              <div className="mt-8 text-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  About Me
                </h2>
                <p className="text-gray-600 mt-2 italic">
                  {profile.bio || "No biography provided."}
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  Settings
                </h3>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  {/* Butoanele au rămas, dar acum sunt doar pentru acțiuni viitoare */}
                  <button
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors"
                    onClick={() =>
                      alert("Functionality for 'Edit Profile' to be added.")
                    }
                  >
                    Edit Profile
                  </button>
                  <button
                    className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none transition-colors"
                    onClick={() =>
                      alert("Functionality for 'Change Password' to be added.")
                    }
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
