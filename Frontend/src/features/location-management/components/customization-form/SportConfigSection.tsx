// features/location-management/components/customization-form/SportConfigsSection.tsx
import { useState } from "react";
import { Button, Select, Label, TextInput, Spinner } from "flowbite-react";
import { Trash2 } from "lucide-react";
import { useLocations } from "../../hooks/useLocation";
import SectionCard from "./SectionCard";
import type { components } from "../../../../types/api.generated";

const AVAILABLE_SPORTS = ["Fotbal", "Tenis", "Baschet", "Volei", "Padel"];
type SportConfigDTO = components["schemas"]["SportConfigurationDTO"];

export default function SportConfigsSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const {
    locationDetails,
    addSportConfiguration,
    deleteSportConfiguration,
    isProcessing,
  } = useLocations(businessId, locationId);

  const [newSport, setNewSport] = useState({
    sportName: "",
    minBookingDuration: 60,
    bookingSlotIncrement: 30,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewSport((prev) => ({
      ...prev,
      [name]: name === "sportName" ? value : parseInt(value, 10),
    }));
  };

  const handleAddSport = () => {
    if (!newSport.sportName) return;

    const body: Omit<SportConfigDTO, "id"> = {
      sportName: newSport.sportName,
      minBookingDuration: newSport.minBookingDuration,
      bookingSlotIncrement: newSport.bookingSlotIncrement,
    };

    addSportConfiguration({
      params: {
        path: { businessAccountId: businessId, locationId: locationId },
      },
      body: body,
    });

    setNewSport({
      sportName: "",
      minBookingDuration: 60,
      bookingSlotIncrement: 30,
    });
  };

  const handleDeleteSport = (configId: number) => {
    deleteSportConfiguration({
      params: {
        path: {
          businessAccountId: businessId,
          locationId: locationId,
          configId: configId,
        },
      },
    });
  };

  const configuredSportNames =
    locationDetails?.sportConfigurations?.map((s) => s.sportName) || [];
  const availableOptions = AVAILABLE_SPORTS.filter(
    (s) => !configuredSportNames.includes(s)
  );

  return (
    <SectionCard title="Configurare Sporturi">
      <div className="space-y-3 mb-6">
        {locationDetails?.sportConfigurations?.map((config) => (
          <div
            key={config.id}
            className="flex items-center justify-between p-3 border rounded-lg "
          >
            <div>
              <span className="font-medium">{config.sportName}</span>
              <p className="text-sm text-gray-500">
                Durată min: {config.minBookingDuration} min, Slot:{" "}
                {config.bookingSlotIncrement} min
              </p>
            </div>
            <Button
              size="sm"
              color="failure"
              onClick={() => handleDeleteSport(config.id!)}
              disabled={isProcessing}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        {locationDetails?.sportConfigurations?.length === 0 && (
          <p className="text-gray-500 italic">Niciun sport configurat.</p>
        )}
      </div>

      {/* Formular de adăugare */}
      <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-4 border-t pt-4">
        <div className="md:col-span-2">
          <Label htmlFor="sportName">Sport</Label>
          <Select
            id="sportName"
            name="sportName"
            value={newSport.sportName}
            onChange={handleInputChange}
            disabled={availableOptions.length === 0}
          >
            <option value="">Alege un sport</option>
            {availableOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="minBookingDuration">Durată Min (min)</Label>
          <TextInput
            id="minBookingDuration"
            name="minBookingDuration"
            type="number"
            value={newSport.minBookingDuration}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleAddSport}
            disabled={isProcessing || !newSport.sportName}
            className="w-full"
          >
            {isProcessing ? <Spinner size="sm" /> : "Adaugă"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
