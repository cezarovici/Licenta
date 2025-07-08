import { useState, useEffect } from "react";
import { Label, Button, Spinner, Select } from "flowbite-react";
import { useLocations } from "../../hooks/useLocation";
import SectionCard from "./SectionCard";
import type { OperatingHour } from "../../../../types/api";

const DAYS_OF_WEEK = [
  { api: "MONDAY", label: "Luni" },
  { api: "TUESDAY", label: "Marți" },
  { api: "WEDNESDAY", label: "Miercuri" },
  { api: "THURSDAY", label: "Joi" },
  { api: "FRIDAY", label: "Vineri" },
  { api: "SATURDAY", label: "Sâmbătă" },
  { api: "SUNDAY", label: "Duminică" },
];

type TimeField = "openTime" | "closeTime";

const formatTimeValue = (time: string | undefined, fallback = "00") =>
  time?.split(":")[0] || fallback;

const TimeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <Select value={value} onChange={(e) => onChange(e.target.value)}>
    {Array.from({ length: 24 }, (_, i) => {
      const v = String(i).padStart(2, "0");
      return (
        <option key={v} value={v}>
          {v}
        </option>
      );
    })}
  </Select>
);

export default function OperatingHoursSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const { operatingHours, updateOperatingHours, isProcessing } = useLocations(
    businessId,
    locationId
  );
  const [hours, setHours] = useState<OperatingHour[]>([]);

  useEffect(() => {
    if (Array.isArray(operatingHours)) {
      const sanitized = DAYS_OF_WEEK.map(({ api }) => {
        const existing = operatingHours.find((h) => h.dayOfWeek === api);
        return {
          dayOfWeek: api,
          openTime: existing?.openTime || "09:00",
          closeTime: existing?.closeTime || "17:00",
        };
      });
      setHours(sanitized);
    }
  }, [operatingHours]);

  const updateHour = (dayOfWeek: string, field: TimeField, hour: string) => {
    setHours((prev) =>
      prev.map((entry) =>
        entry.dayOfWeek === dayOfWeek
          ? {
              ...entry,
              [field]: `${hour}:${entry[field].split(":")[1]}`,
            }
          : entry
      )
    );
  };

  const handleSave = () => {
    updateOperatingHours({
      params: {
        path: {
          businessAccountId: businessId,
          locationId: locationId,
        },
      },
      body: { hours },
    });
  };

  return (
    <SectionCard title="Program de Funcționare">
      <div className="space-y-3">
        {DAYS_OF_WEEK.map(({ api, label }) => {
          const entry = hours.find((h) => h.dayOfWeek === api);
          const openHour = formatTimeValue(entry?.openTime);
          const closeHour = formatTimeValue(entry?.closeTime);

          return (
            <div
              key={api}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-4"
            >
              <Label className="font-semibold">{label}</Label>
              <div className="flex gap-2 col-span-2">
                <TimeSelect
                  value={openHour}
                  onChange={(val) => updateHour(api, "openTime", val)}
                />
                <TimeSelect
                  value={closeHour}
                  onChange={(val) => updateHour(api, "closeTime", val)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isProcessing} color="primary">
          {isProcessing ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Se salvează...</span>
            </>
          ) : (
            "Salvează Programul"
          )}
        </Button>
      </div>
    </SectionCard>
  );
}
