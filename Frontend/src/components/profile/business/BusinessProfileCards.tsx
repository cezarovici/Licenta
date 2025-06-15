import { useEffect, useState } from "react";
import {
  getCurrentBusinessProfile,
  type BusinessProfile,
} from "../../../lib/profile/businessProfile";
import ProfilePlaceholder from "../ProfilePlaceholder";
import LocationForm from "../../business/locations/LocationForm";
import BusinessLocationList from "../../business/locations/BusinessLocationList";

export default function BusinessProfileCard() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showAddLocationForm, setShowAddLocationForm] =
    useState<boolean>(false); // Stare pentru a arăta/ascunde formularul

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const businessProfile = await getCurrentBusinessProfile();
        setProfile(businessProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching business profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Callback pentru când o locație nouă este adăugată din formular
  const handleLocationAdded = (newLocation: Location) => {
    if (profile) {
      // Re-fetch locațiile sau adaugă noua locație în lista existentă,
      // în funcție de preferințe. Re-fetch e mai simplu pentru consistență.
      // Pentru simplitate, momentan nu facem refresh, dar o poți adăuga.
      // Ar fi ideal să re-fetch 'getBusinessLocations' sau să actualizezi starea `locations` din `BusinessLocationList`
      // For now, let's just close the form and maybe show a success message on the list component
      console.log(
        "New location added, you might want to refresh the list.",
        newLocation
      );
      setShowAddLocationForm(false); // Ascunde formularul după adăugare
      // Aici poți apela o metodă din BusinessLocationList pentru a reîncărca lista
    }
  };

  if (loading || error) {
    return <ProfilePlaceholder loading={loading} error={error} />;
  }

  if (!profile) {
    return (
      <ProfilePlaceholder loading={false} error="No business profile data." />
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto bg-gray-50 shadow-xl rounded-2xl overflow-hidden">
      <div className="h-32 bg-green-600 bg-gradient-to-r from-teal-500 to-green-700" />
      <div className="p-8 -mt-20">
        <div className="flex flex-col items-center">
          <img
            src={
              profile.photoUrl ||
              "https://via.placeholder.com/128?text=Business"
            }
            alt={profile.companyName}
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {profile.companyName}
          </h1>
          <p className="text-sm text-gray-500">
            Reg. No: {profile.registrationNumber}
          </p>
          <p className="text-sm text-gray-500">ID: {profile.accountId}</p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold text-gray-700">About Us</h2>
          <p className="text-gray-600 mt-2 italic">
            {profile.businessDescription || "No description provided."}
          </p>
        </div>

        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Contact & Location Info
          </h2>
          <p className="text-gray-600 mt-2">Email: {profile.contactEmail}</p>
          <p className="text-gray-600">Phone: {profile.phoneNumber}</p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Manage Locations
          </h3>
          {/* Buton pentru a afișa/ascunde formularul de adăugare locație */}
          <button
            onClick={() => setShowAddLocationForm(!showAddLocationForm)}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none transition-colors mb-4"
          >
            {showAddLocationForm
              ? "Hide Add Location Form"
              : "Add New Location"}
          </button>

          {/* Formularul de adăugare locație (afișat condiționat) */}
          {showAddLocationForm && (
            <LocationForm
              businessAccountId={profile.accountId}
              onLocationAdded={handleLocationAdded}
            />
          )}

          {/* Lista de locații */}
          <BusinessLocationList businessAccountId={profile.accountId} />
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Settings
          </h3>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none transition-colors"
              onClick={() =>
                alert("Functionality for 'Edit Business Profile' to be added.")
              }
            >
              Edit Business Profile
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none transition-colors"
              onClick={() =>
                alert(
                  "Functionality for 'Business Account Settings' to be added."
                )
              }
            >
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
