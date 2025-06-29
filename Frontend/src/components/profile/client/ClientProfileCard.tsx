import React, { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  type ClientProfile,
} from "../../../lib/profile/clientProfile";
import ProfilePlaceholder from "../ProfilePlaceholder";

export default function ClientProfileCard() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching client profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || error) {
    return <ProfilePlaceholder loading={loading} error={error} />;
  }

  if (!profile) {
    return (
      <ProfilePlaceholder loading={false} error="No client profile data." />
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="h-32 bg-indigo-500 bg-gradient-to-r from-purple-500 to-indigo-600" />
      <div className="p-8 -mt-20">
        <div className="flex flex-col items-center">
          <img
            src={profile.profilePhotoUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-gray-500">
            Member ID: {profile.accountId}
          </p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold text-gray-700">About Me</h2>
          <p className="text-gray-600 mt-2 italic">
            {profile.bio || "No biography provided."}
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Settings
          </h3>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
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
                alert("Functionality for 'Account Settings' to be added.")
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
