// features/location-management/components/customization-form/BookingRulesSection.tsx
import { useState, useEffect } from "react";
import { Button, TextInput, Label, Select, Spinner } from "flowbite-react";
import { useLocations } from "../../hooks/useLocation";
import SectionCard from "./SectionCard";
import type { components } from "../../../../types/api.generated";

type BookingRulesUpdateBody =
  components["schemas"]["BookingRulesUpdateRequest"];

export default function BookingRulesSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const { locationDetails, updateBookingRules, isProcessing } = useLocations(
    businessId,
    locationId
  );

  // Starea locală este acum aliniată cu schema API
  const [rules, setRules] = useState<BookingRulesUpdateBody>({
    maxBookingAdvanceDays: 30,
    cancellationPolicy: "FLEXIBLE",
  });

  useEffect(() => {
    if (locationDetails?.bookingRules) {
      setRules({
        maxBookingAdvanceDays:
          locationDetails.bookingRules.maxBookingAdvanceDays || 30,
        cancellationPolicy:
          locationDetails.bookingRules.cancellationPolicy || "FLEXIBLE",
      });
    }
  }, [locationDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRules((prev) => ({
      ...prev,
      [name]:
        name === "maxBookingAdvanceDays" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSave = () => {
    updateBookingRules({
      params: {
        path: { businessAccountId: businessId, locationId: locationId },
      },
      body: rules,
    });
  };

  return (
    <SectionCard title="Reguli de Rezervare">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="maxBookingAdvanceDays">
            "Rezervare în avans (zile)
          </Label>
          <TextInput
            id="maxBookingAdvanceDays"
            name="maxBookingAdvanceDays"
            type="number"
            value={rules.maxBookingAdvanceDays}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Numărul maxim de zile în avans pentru o rezervare.
          </p>
        </div>
        <div>
          <Label htmlFor="cancellationPolicy">Politică de anulare</Label>
          <Select
            id="cancellationPolicy"
            name="cancellationPolicy"
            value={rules.cancellationPolicy}
            onChange={handleChange}
            required
          >
            <option value="FLEXIBLE">Flexibilă</option>
            <option value="MODERATE">Moderată</option>
            <option value="STRICT">Strictă</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isProcessing} color="primary">
          {isProcessing ? <Spinner size="sm" /> : "Salvează Regulile"}
        </Button>
      </div>
    </SectionCard>
  );
}
