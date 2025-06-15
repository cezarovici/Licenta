import React from "react";
import type { Location } from "../../../types/location";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {location.name}
      </h3>
      <p className="text-gray-600 mb-1">{location.address}</p>
      {location.latitude && location.longitude && (
        <p className="text-sm text-gray-500">
          Lat: {location.latitude.toFixed(4)}, Long:{" "}
          {location.longitude.toFixed(4)}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-700">
        {/* Aici poți adăuga link-uri sau butoane pentru detalii, editare, ștergere */}
        <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
          View Details
        </button>
        <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors">
          Edit
        </button>
        <button className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
