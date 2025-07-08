import React from "react";
import { Spinner } from "flowbite-react";
import { useLocations } from "../../location-management/hooks/useLocation";
import { FacilitiesList } from "../../../components/locations/LocationFacilitiesList";

interface Props {
  locationId: number;
  businessId: number;
}

export const LocationDetailsSection: React.FC<Props> = ({
  locationId,
  businessId,
}) => {
  const { locationDetails, isLoading } = useLocations(businessId, locationId);

  if (isLoading) {
    return <Spinner />;
  }

  if (!locationDetails) {
    return null;
  }

  const facilityNames = locationDetails.facilities;
  const schedule = locationDetails.operatingHours.reduce(
    (acc, day) => {
      acc[day.dayOfWeek] = `${day.openTime} - ${day.closeTime}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <>
      <hr className="border-gray-200" />

      {/* 2. Facilități */}
      <FacilitiesList facilities={facilityNames} />

      <hr className="border-gray-200" />

      {/* 3. Program */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Program</h2>
        <ul className="space-y-2 text-gray-600">
          {Object.entries(schedule).map(([day, hours]) => (
            <li key={day} className="flex justify-between">
              <span>{day}</span>
              <span className="font-semibold">{hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
