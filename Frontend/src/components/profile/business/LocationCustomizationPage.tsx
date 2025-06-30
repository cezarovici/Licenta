import { useState, useEffect } from "react";
import { Button, FloatingLabel, Spinner, Alert, Card } from "flowbite-react";
import type { components } from "../../../types/api.generated";
import {} from "../../../lib/location/locationApi"; // Presupunând că aceste funcții există

type Location = components["schemas"]["LocationCreateRequestDTO"];
type LocationUpdateRequest = components["schemas"]["LocationUpdateRequest"]; // Presupunând că acest tip există

interface LocationCustomizationPageProps {
  locationId: number;
  onBack: () => void;
}

export default function LocationCustomizationPage({
  locationId,
  onBack,
}: LocationCustomizationPageProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<Partial<LocationUpdateRequest>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        //const locationData = await getLocationDetails(locationId);
      } catch (error) {
        setStatusMessage({
          type: "error",
          message: "Nu am putut încărca detaliile locației.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      //await updateLocationDetails(locationId, formData); // Funcție de implementat
      setStatusMessage({
        type: "success",
        message: "Locația a fost actualizată cu succes!",
      });
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "A apărut o eroare.";
      setStatusMessage({ type: "error", message: `Eroare: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner size="xl" />
        <p className="mt-4">Se încarcă detaliile locației...</p>
      </div>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">
        Customizare Locație: {location?.name}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingLabel
          name="name"
          label="Nume Locație"
          variant="outlined"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
        <FloatingLabel
          name="address"
          label="Adresă"
          variant="outlined"
          value={formData.address || ""}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel
            name="latitude"
            label="Latitudine"
            type="number"
            variant="outlined"
            value={formData.latitude?.toString() || ""}
            onChange={handleChange}
          />
          <FloatingLabel
            name="longitude"
            label="Longitudine"
            type="number"
            variant="outlined"
            value={formData.longitude?.toString() || ""}
            onChange={handleChange}
          />
        </div>
        {statusMessage && (
          <Alert
            color={statusMessage.type === "success" ? "success" : "failure"}
          >
            {statusMessage.message}
          </Alert>
        )}
        <div className="flex justify-between">
          <Button color="gray" onClick={onBack} disabled={isSubmitting}>
            Înapoi
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : "Salvează Modificările"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
