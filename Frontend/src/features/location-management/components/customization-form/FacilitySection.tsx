import { useState, useEffect } from "react";
import { Checkbox, Label, Button, Spinner } from "flowbite-react";
import { useLocations } from "../../hooks/useLocation";
import SectionCard from "./SectionCard";
import type { components } from "../../../../types/api.generated";

type FacilityDTO = components["schemas"]["FacilityDTO"];

const ALL_FACILITIES: FacilityDTO[] = [
  { id: 1, name: "Wi-Fi Gratuit" },
  { id: 2, name: "Parcare" },
  { id: 3, name: "Dușuri și Vestiare" },
  { id: 4, name: "Nocturnă" },
  { id: 5, name: "Închiriere Echipament" },
  { id: 6, name: "Tribună/Spectatori" },
  { id: 7, name: "Bar/Cafenea" },
];

export default function FacilitiesSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const { facilities, updateFacilities, isProcessing } = useLocations(
    businessId,
    locationId
  );
  console.log(facilities);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (Array.isArray(facilities)) {
      const initialIds = facilities.map((facility) => facility.id);
      console.log(initialIds);
      setSelectedIds(initialIds);
    }
  }, [facilities]);

  /**
   * Gestionează adăugarea/ștergerea unui ID din starea locală.
   * @param facilityId - ID-ul numeric al facilității.
   */
  const handleToggleFacility = (facilityId: number) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(facilityId)
        ? prevIds.filter((id) => id !== facilityId)
        : [...prevIds, facilityId]
    );
  };

  /**
   * Pregătește și trimite datele către API la salvare.
   */
  const handleSave = () => {
    const selectedFacilities: FacilityDTO[] = ALL_FACILITIES.filter((f) =>
      selectedIds.includes(f.id)
    );

    updateFacilities({
      params: {
        path: {
          businessAccountId: businessId,
          locationId: locationId,
        },
      },
      body: {
        facilityIds: selectedFacilities,
      },
    });
  };

  return (
    <SectionCard title="Facilități Oferite">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ALL_FACILITIES.map((facility) => (
          <div key={facility.id} className="flex items-center gap-2">
            <Checkbox
              id={`facility-${facility.id}`}
              checked={selectedIds.includes(facility.id)}
              onChange={() => handleToggleFacility(facility.id)}
            />
            <Label htmlFor={`facility-${facility.id}`}>{facility.name}</Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isProcessing} color="primary">
          {isProcessing ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Se salvează...</span>
            </>
          ) : (
            "Salvează Facilitățile"
          )}
        </Button>
      </div>
    </SectionCard>
  );
}
