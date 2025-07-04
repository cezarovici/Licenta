import type { LocationSummaryDTO } from "../../lib/location/locationApi";
import { Card, Button } from "flowbite-react";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface SearchResultItemProps {
  result: LocationSummaryDTO;
}

export default function SearchResultItem({ result }: SearchResultItemProps) {
  return (
    <Card
      imgSrc={`https://source.unsplash.com/400x200/?stadium,gym,${result.name}`}
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
        href={`/locations/${result.id}`}
        className="mt-4"
        color="alternative"
      >
        Vezi Detalii Locație
      </Button>
    </Card>
  );
}
