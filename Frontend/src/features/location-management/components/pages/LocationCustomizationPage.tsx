import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Label,
  Checkbox,
  Card,
  Spinner,
  Select,
} from "flowbite-react";
import type { components } from "../../../../types/api.generated";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

type LocationDetails = components["schemas"]["LocationDetailDTO"];

const DAYS_OF_WEEK_API = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
const DAYS_OF_WEEK_RO = [
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
  "Duminică",
];
const ALL_FACILITIES = [
  { id: 1, name: "Parcare" },
  { id: 2, name: "Vestiar" },
  { id: 3, name: "Dușuri" },
  { id: 4, name: "Wi-Fi" },
  { id: 5, name: "Nocturnă" },
];

type LocationCustomizationFormProps = {
  location: LocationDetails;
  onSave: (data: LocationDetails) => void;
  isSaving: boolean;
};

export default function LocationCustomizationForm({
  location,
  onSave,
  isSaving,
}: LocationCustomizationFormProps) {
  const [formData, setFormData] = useState<LocationDetails>(location);
  console.log(location);
  useEffect(() => {
    // Asigurăm că formularul se resetează corect când se schimbă locația selectată
    setFormData(location);
  }, [location.id]);

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const timeStringToObj = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return { hour, minute, second: 0, nano: 0 };
  };

  const handleHoursChange = (
    dayOfWeek: string,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setFormData((prev) => {
      let hoursExist = prev.operatingHours.some(
        (h) => h.dayOfWeek === dayOfWeek
      );
      let updatedHours;

      if (hoursExist) {
        updatedHours = prev.operatingHours.map((h) =>
          h.dayOfWeek === dayOfWeek
            ? { ...h, [field]: timeStringToObj(value) }
            : h
        );
      } else {
        const newHourEntry = {
          dayOfWeek,
          openTime:
            field === "openTime"
              ? timeStringToObj(value)
              : { hour: 0, minute: 0, second: 0, nano: 0 },
          closeTime:
            field === "closeTime"
              ? timeStringToObj(value)
              : { hour: 0, minute: 0, second: 0, nano: 0 },
        };
        updatedHours = [...prev.operatingHours, newHourEntry];
      }

      return { ...prev, operatingHours: updatedHours };
    });
  };

  const handleFacilityChange = (facilityId: number, checked: boolean) => {
    setFormData((prev) => {
      const currentFacilities = prev.facilities || [];
      const currentIds = currentFacilities
        .map((f) => f.id)
        .filter((id) => id !== undefined) as number[];
      const newIds = checked
        ? [...currentIds, facilityId]
        : currentIds.filter((id) => id !== facilityId);

      return {
        ...prev,
        facilities: newIds.map((id) => ({
          id,
          name: ALL_FACILITIES.find((f) => f.id === id)?.name || "",
        })),
      };
    });
  };

  const handlePricingRuleChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedRules = [...prev.pricingRules];
      updatedRules[index] = { ...updatedRules[index], [field]: value };
      return { ...prev, pricingRules: updatedRules };
    });
  };

  const addPricingRule = () => {
    setFormData((prev) => ({
      ...prev,
      pricingRules: [
        ...prev.pricingRules,
        { ruleName: "", daysOfWeek: [], pricePerHour: 0 },
      ],
    }));
  };

  const removePricingRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingRules: prev.pricingRules.filter((_, i) => i !== index),
    }));
  };

  const handleSportConfigChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedConfigs = [...prev.sportConfigurations];
      updatedConfigs[index] = { ...updatedConfigs[index], [field]: value };
      return { ...prev, sportConfigurations: updatedConfigs };
    });
  };

  const addSportConfig = () => {
    setFormData((prev) => ({
      ...prev,
      sportConfigurations: [
        ...prev.sportConfigurations,
        { sportName: "", minBookingDuration: 60, bookingSlotIncrement: 30 },
      ],
    }));
  };

  const removeSportConfig = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sportConfigurations: prev.sportConfigurations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleBookingRulesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        [name]: name === "maxBookingAdvanceDays" ? parseInt(value, 10) : value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Detalii de Bază */}
      <Card>
        <h3 className="text-xl font-bold">Detalii de Bază</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <Label htmlFor="name">Numele Locației</Label>
            <TextInput
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Adresa</Label>
            <TextInput
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        </div>
      </Card>

      {/* Program de Funcționare */}
      <Card>
        <h3 className="text-xl font-bold">Program de Funcționare</h3>
        {DAYS_OF_WEEK_RO.map((dayName, index) => {
          const apiDay = DAYS_OF_WEEK_API[index];
          const hours = formData.operatingHours.find(
            (h) => h.dayOfWeek === apiDay
          );
          return (
            <div
              key={apiDay}
              className="grid grid-cols-3 items-center gap-4 mt-2"
            >
              <Label className="font-semibold">{dayName}</Label>
              <TextInput
                type="time"
                value={hours?.openTime?.slice(0, 5) || ""}
                onChange={(e) =>
                  handleHoursChange(apiDay, "openTime", e.target.value)
                }
              />
              <TextInput
                type="time"
                value={hours?.closeTime?.slice(0, 5) || ""}
                onChange={(e) =>
                  handleHoursChange(apiDay, "closeTime", e.target.value)
                }
              />
            </div>
          );
        })}
      </Card>

      {/* Facilități */}
      <Card>
        <h3 className="text-xl font-bold">Facilități</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {ALL_FACILITIES.map((facility) => (
            <div key={facility.id} className="flex items-center gap-2">
              <Checkbox
                id={`facility-${facility.id}`}
                checked={formData.facilities.some((f) => f.id === facility.id)}
                onChange={(e) =>
                  handleFacilityChange(facility.id, e.target.checked)
                }
              />
              <Label htmlFor={`facility-${facility.id}`}>{facility.name}</Label>
            </div>
          ))}
        </div>
      </Card>

      {/* --- SECȚIUNI NOI --- */}

      {/* Reguli de Preț */}
      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Reguli de Preț</h3>
          <Button size="sm" color="gray" onClick={addPricingRule}>
            <PlusIcon className="h-4 w-4 mr-2" /> Adaugă Regulă
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          {formData.pricingRules.map((rule, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              <Button
                color="failure"
                size="xs"
                className="absolute top-2 right-2"
                onClick={() => removePricingRule(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput
                  placeholder="Nume regulă (ex: Weekend)"
                  value={rule.ruleName}
                  onChange={(e) =>
                    handlePricingRuleChange(index, "ruleName", e.target.value)
                  }
                />
                <TextInput
                  type="time"
                  value={
                    typeof rule.startTime === "string"
                      ? rule.startTime
                      : rule.startTime &&
                          typeof rule.startTime === "object" &&
                          rule.startTime.hour !== undefined &&
                          rule.startTime.minute !== undefined
                        ? `${String(rule.startTime.hour).padStart(2, "0")}:${String(rule.startTime.minute).padStart(2, "0")}`
                        : ""
                  }
                  onChange={(e) =>
                    handlePricingRuleChange(index, "startTime", e.target.value)
                  }
                />
                <TextInput
                  type="time"
                  value={
                    typeof rule.endTime === "string"
                      ? rule.endTime
                      : rule.endTime &&
                          typeof rule.endTime === "object" &&
                          rule.endTime.hour !== undefined &&
                          rule.endTime.minute !== undefined
                        ? `${String(rule.endTime.hour).padStart(2, "0")}:${String(rule.endTime.minute).padStart(2, "0")}`
                        : ""
                  }
                  onChange={(e) =>
                    handlePricingRuleChange(index, "endTime", e.target.value)
                  }
                />
                <TextInput
                  type="number"
                  placeholder="Preț / oră"
                  value={rule.pricePerHour}
                  onChange={(e) =>
                    handlePricingRuleChange(
                      index,
                      "pricePerHour",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configurații Sportive */}
      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Configurații Sportive</h3>
          <Button size="sm" color="gray" onClick={addSportConfig}>
            <PlusIcon className="h-4 w-4 mr-2" /> Adaugă Sport
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          {formData.sportConfigurations.map((config, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              <Button
                color="failure"
                size="xs"
                className="absolute top-2 right-2"
                onClick={() => removeSportConfig(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <TextInput
                  placeholder="Nume sport (ex: Fotbal)"
                  value={config.sportName}
                  onChange={(e) =>
                    handleSportConfigChange(index, "sportName", e.target.value)
                  }
                />
                <TextInput
                  placeholder="Tip suprafață"
                  value={config.surfaceType || ""}
                  onChange={(e) =>
                    handleSportConfigChange(
                      index,
                      "surfaceType",
                      e.target.value
                    )
                  }
                />
                <TextInput
                  placeholder="Capacitate (ex: 5 vs 5)"
                  value={config.recommendedCapacity || ""}
                  onChange={(e) =>
                    handleSportConfigChange(
                      index,
                      "recommendedCapacity",
                      e.target.value
                    )
                  }
                />
                <TextInput
                  type="number"
                  addon="min"
                  value={config.minBookingDuration}
                  onChange={(e) =>
                    handleSportConfigChange(
                      index,
                      "minBookingDuration",
                      parseInt(e.target.value)
                    )
                  }
                />
                <TextInput
                  type="number"
                  addon="min"
                  value={config.bookingSlotIncrement}
                  onChange={(e) =>
                    handleSportConfigChange(
                      index,
                      "bookingSlotIncrement",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reguli de Rezervare */}
      <Card>
        <h3 className="text-xl font-bold">Reguli Generale de Rezervare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <Label htmlFor="maxBookingAdvanceDays">
              Rezervare în avans (zile)
            </Label>
            <TextInput
              id="maxBookingAdvanceDays"
              name="maxBookingAdvanceDays"
              type="number"
              value={formData.bookingRules.maxBookingAdvanceDays || 30}
              onChange={handleBookingRulesChange}
            />
          </div>
          <div>
            <Label htmlFor="cancellationPolicy">Politică de anulare</Label>
            <Select
              id="cancellationPolicy"
              name="cancellationPolicy"
              value={formData.bookingRules.cancellationPolicy}
              onChange={handleBookingRulesChange}
            >
              <option value="FLEXIBLE">Flexibilă</option>
              <option value="MODERATE">Moderată</option>
              <option value="STRICT">Strictă</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Buton Salvare */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Spinner size="sm" /> <span className="pl-3">Se salvează...</span>
            </>
          ) : (
            "Salvează Toate Modificările"
          )}
        </Button>
      </div>
    </form>
  );
}
