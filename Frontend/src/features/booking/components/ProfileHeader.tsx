import React from "react";
import { useLocations } from "../../location-management/hooks/useLocation";

interface Props {
  locationId: number;
  businessId: number;
}

export const ProfileHeader: React.FC<Props> = ({ locationId, businessId }) => {
  const { locationDetails, isLoading } = useLocations(businessId, locationId);

  if (isLoading) {
    return (
      <div>
        <div className="h-10  rounded w-3/4 animate-pulse"></div>
        <div className="h-6  rounded w-1/2 mt-2 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        {locationDetails?.name}
      </h1>
      <p className="mt-2 text-lg text-gray-500">{locationDetails?.address}</p>
    </div>
  );
};
export default ProfileHeader;
