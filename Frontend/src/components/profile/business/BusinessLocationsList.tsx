import { Alert, Button } from "flowbite-react";
import AddLocationModal from "./AddLocationModal";
import { useState } from "react";
import { createLocationForBusiness } from "../../../lib/location/locationApi";
import type { Location, LocationCreatePayload } from "../../../types/api";

interface BusinessLocationsListProps {
  locations: Location[];
  accountId: number;
  onLocationAdded: () => void;
}

export default function BusinessLocationsList({
  locations,
  accountId,
  onLocationAdded,
}: BusinessLocationsListProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "failure";
    message: string;
  } | null>(null);

  const [modalStatus, setModalStatus] = useState<{
    type: "failure";
    message: string;
  } | null>(null);

  const handleAddLocation = async (formData: LocationCreatePayload) => {
    setIsSubmitting(true);
    setModalStatus(null);
    setStatusMessage(null);

    try {
      await createLocationForBusiness(accountId, formData);

      onLocationAdded();

      setStatusMessage({
        type: "success",
        message: "Locația a fost adăugată cu succes!",
      });

      setShowModal(false);

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Failed to add location:", error);
      const errorMessage =
        error instanceof Error ? error.message : "A apărut o eroare.";
      setModalStatus({ type: "failure", message: `Eroare: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setModalStatus(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
  };

  return (
    <>
      {statusMessage && statusMessage.type === "success" && (
        <Alert
          color="success"
          onDismiss={() => setStatusMessage(null)}
          className="mb-4"
        >
          {statusMessage.message}
        </Alert>
      )}

      <div className="p-6 bg-section border border-standard rounded-lg">
        <h2 className="font-semibold text-xl text-heading mb-4">
          Locații Asociate
        </h2>
        {locations && locations.length > 0 ? (
          <ul className="space-y-3">
            {locations.map((loc, index) => (
              <li
                key={index}
                className="p-3 bg-main rounded-md border border-standard"
              >
                <p className="text-secondary text-sm">{loc.name}</p>
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
        >
          Adaugă Locație Nouă
        </Button>
      </div>

      <AddLocationModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleAddLocation}
        isSubmitting={isSubmitting}
        statusMessage={modalStatus}
      />
    </>
  );
}
