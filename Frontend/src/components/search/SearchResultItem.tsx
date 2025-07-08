import { Card, Button } from "flowbite-react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import type { LocationSummary } from "../../types/api";
import { useState } from "react";
import { useLocations } from "../../features/location-management/hooks/useLocation";

interface SearchResultItemProps {
  result: LocationSummary;
}

export default function SearchResultItem({ result }: SearchResultItemProps) {
  const { locationDetails } = useLocations(undefined, result.id);
  const [businessId, setBusinessId] = useState<number>(
    locationDetails?.business.id || 0
  );

  return (
    <Card
      imgSrc={locationDetails?.photos[0].photoUrl || ""}
      imgAlt={`Imagine pentru ${result.name}`}
    >
      <h5 className="text-xl font-bold tracking-tight text-heading">
        {result.name}
      </h5>

      <div className="flex items-center text-sm text-secondary mt-1">
        <HiOutlineLocationMarker className="mr-2" />
        <span>{result.address}</span>
      </div>

      <Button
        href={`/business/${businessId}/location-view/${result.id}`}
        className="mt-4"
        color="alternative"
      >
        Vezi Detalii Locație
      </Button>
    </Card>
  );
}
