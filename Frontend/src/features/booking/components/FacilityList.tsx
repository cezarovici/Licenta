import { Spinner } from "flowbite-react";
import { useLocations } from "../../location-management/hooks/useLocation";

interface Props {
  locationId: number;
  businessId: number;
}

export const FacilityList: React.FC<Props> = ({ locationId, businessId }) => {
  const { locationDetails, isLoading } = useLocations(businessId, locationId);

  if (isLoading) {
    return <Spinner />;
  }

  if (!locationDetails) {
    return null;
  }

  const facilityNames = locationDetails.facilities.map((f) => f.name);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Facilități</h2>
      <ul className="space-y-2 text-gray-600">
        {facilityNames.map((facility) => (
          <li key={facility} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 3a4.002 4.002 0 00-3.874 3H7a2.002 2.002 0 012-2h2a2.002 2.002 0 012 2h.874A4.002 4.002 0 0010 10z" />
            </svg>
            {facility}
          </li>
        ))}
      </ul>
    </div>
  );
};
