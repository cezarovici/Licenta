import { Button } from "flowbite-react";
import { useState } from "react";
import { useLocations } from "../hooks/useLocation";

export default function BusinessLocationsList({
  businessId,
}: {
  businessId: number;
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { allLocations: locations, isProcessing: isSubmitting } =
    useLocations(businessId);

  const handleLocationClick = (locationId: number) => {
    window.location.href = `/locations/${locationId}`;
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
              <li
                key={loc.id}
                onClick={() => handleLocationClick(loc.id)}
                className="p-3 bg-main rounded-md border border-standard cursor-pointer transition-colors hover:bg-gray-200 hover:border-primary"
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

      {/* <AddLocation
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddLocation}
        isSubmitting={isSubmitting}
        statusMessage={
          modalError ? { type: "failure", message: modalError } : null
        }
      /> */}
    </>
  );
}
