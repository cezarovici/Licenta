import { Button } from "flowbite-react";
import AddLocationModal from "./AddLocationModal";
import { useState } from "react";
import type {
  LocationCreatePayload,
  LocationSummary,
} from "../../../types/api";

// 1. Adaugă `onLocationClick` în definiția de tipuri pentru props.
interface BusinessLocationsListProps {
  locations: LocationSummary[];
  accountId: number;
  onLocationAdded: () => void;
  createLocation: (payload: any) => void;
  isSubmitting: boolean;
  onLocationClick: (id: number) => void; // <-- ADAUGAT
}

export default function BusinessLocationsList({
  locations,
  accountId,
  onLocationAdded,
  createLocation,
  isSubmitting,
  onLocationClick, // 2. Extrage funcția din props.
}: BusinessLocationsListProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleAddLocation = async (formData: LocationCreatePayload) => {
    const payload = {
      params: { path: { businessAccountId: accountId } },
      body: formData,
    };
    createLocation(payload);
  };

  const handleOpenModal = () => {
    setModalError(null);
    setShowModal(true);
  };

  return (
    <>
      <div className="p-6 bg-section border border-standard rounded-lg">
        <h2 className="font-semibold text-xl text-heading mb-4">
          Locații Asociate
        </h2>
        {locations && locations.length > 0 ? (
          <ul className="space-y-3">
            {locations.map((loc) => (
              // 3. Modifică elementul `li` pentru a fi clicabil.
              <li
                key={loc.id} // <-- MODIFICAT: Folosește `loc.id` în loc de `index`.
                onClick={() => onLocationClick(loc.id)} // <-- ADAUGAT: Apelează funcția la click.
                className="p-3 bg-main rounded-md border border-standard cursor-pointer transition-colors hover:bg-gray-200 hover:border-primary" // <-- ADAUGAT: Stil pentru interactivitate.
              >
                <p className="text-secondary font-medium">{loc.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary italic">
            Nicio locație înregistrată încă.
          </p>
        )}

        <Button
          color="alternative"
          onClick={handleOpenModal}
          className="mt-4 w-full"
          disabled={isSubmitting}
        >
          Adaugă Locație Nouă
        </Button>
      </div>

      <AddLocationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddLocation}
        isSubmitting={isSubmitting}
        statusMessage={
          modalError ? { type: "failure", message: modalError } : null
        }
      />
    </>
  );
}
