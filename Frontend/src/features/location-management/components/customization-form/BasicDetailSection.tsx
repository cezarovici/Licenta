import { useState, useEffect } from "react";
import { TextInput, Label, Button } from "flowbite-react";
import SectionCard from "./SectionCard";

import { useLocations } from "../../hooks/useLocation";

export default function BasicDetailsSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const {
    locationDetails: location,
    isProcessing: isSaving,
    updateLocation,
  } = useLocations(businessId, locationId);

  const [name, setName] = useState(location!.name);
  const [address, setAddress] = useState(location!.address);

  useEffect(() => {
    setName(location!.name);
    setAddress(location!.address);
  }, [location]);

  const handleSave = () => {
    updateLocation({
      params: {
        path: {
          businessAccountId: location?.business.id!,
          locationId: locationId!,
        },
      },
      body: {
        name,
        address,
      },
    });
  };

  return (
    <SectionCard title="Detalii de Bază">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Numele Locației</Label>
          <TextInput
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">Adresa</Label>
          <TextInput
            id="address"
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Se salvează..." : "Salvează Detaliile"}
        </Button>
      </div>
    </SectionCard>
  );
}
