import React, { useState } from "react";
import type { LocationCreatePayload, Location } from "../../../types/location";
import { addBusinessLocation } from "../../../lib/location/locationApi";

interface LocationFormProps {
  businessAccountId: number;
  onLocationAdded: (newLocation: Location) => void; // Callback după adăugare reușită
}

export default function LocationForm({
  businessAccountId,
  onLocationAdded,
}: LocationFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<string>(""); // Folosim string pentru input
  const [longitude, setLongitude] = useState<string>(""); // Folosim string pentru input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validare simplă
    if (!name || !address) {
      setError("Name and Address are required.");
      setLoading(false);
      return;
    }

    const payload: LocationCreatePayload = {
      name,
      address,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    };

    try {
      const newLocation = await addBusinessLocation(businessAccountId, payload);
      setSuccess("Location added successfully!");
      onLocationAdded(newLocation); // Apelez callback-ul
      // Resetare formular
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add location.");
      console.error("Error submitting location:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Location
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Location Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700"
            >
              Latitude (Optional)
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700"
            >
              Longitude (Optional)
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Location"}
        </button>
      </form>
    </div>
  );
}
