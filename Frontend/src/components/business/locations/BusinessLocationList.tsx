import React, { useEffect, useState } from "react";
import type { Location } from "../../../types/location";
import { getBusinessLocations } from "../../../lib/location/locationApi";
import ProfilePlaceholder from "../../profile/ProfilePlaceholder"; // Reutilizăm placeholder-ul
import LocationCard from "./LocationCard"; // Importăm LocationCard

interface BusinessLocationListProps {
  businessAccountId: number;
}

export default function BusinessLocationList({
  businessAccountId,
}: BusinessLocationListProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError("");
        const fetchedLocations = await getBusinessLocations(businessAccountId);
        setLocations(fetchedLocations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch business locations."
        );
        console.error("Error fetching business locations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (businessAccountId) {
      // Asigură-te că ai un accountId valid înainte de a face apelul
      fetchLocations();
    } else {
      setLoading(false);
      setError("Business Account ID not provided.");
    }
  }, [businessAccountId]); // Rulează din nou dacă businessAccountId se schimbă

  if (loading || error) {
    return <ProfilePlaceholder loading={loading} error={error} />;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Locations
      </h2>
      {locations.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No locations added yet. Start by adding one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
