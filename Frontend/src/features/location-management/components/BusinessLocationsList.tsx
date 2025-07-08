import { useState } from "react";
import { Button } from "flowbite-react";
import { HiTrash } from "react-icons/hi";
import { useLocations } from "../hooks/useLocation";
import { ConfirmationModal } from "../../../components/common/ConfirmationModel";
import AddLocationModal from "./customization-form/AddLocationModal";

type Props = {
  businessId: number;
};

export default function BusinessLocationsList({ businessId }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    allLocations: locations,
    isProcessing,
    deleteLocation,
  } = useLocations(businessId);

  const handleLocationClick = (locationId: number) => {
    window.location.href = `business/${businessId}/locations/${locationId}`;
  };

  const handleDeleteClick = (locationId: number) => {
    setDeleteError(null);
    setLocationToDelete(locationId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (locationToDelete === null) return;

    try {
      deleteLocation({
        params: {
          path: {
            businessAccountId: businessId,
            locationId: locationToDelete,
          },
        },
      });
    } catch (err: any) {
      setDeleteError(err?.message || "Eroare la ștergerea locației.");
    } finally {
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  return (
    <>
      <div className="p-6 bg-section border border-standard rounded-lg">
        {/* Am mutat butonul de adăugare în antet pentru o mai bună vizibilitate */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl text-heading">
            Locații Asociate
          </h2>
          <Button
            color="alternative"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isProcessing}
          >
            Adaugă Locație
          </Button>
        </div>

        {deleteError && (
          <p className="text-red-600 text-sm mb-2">{deleteError}</p>
        )}

        {isProcessing && !locations ? (
          <p className="text-secondary italic">Se încarcă locațiile...</p>
        ) : locations?.length > 0 ? (
          <ul className="space-y-3">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className="p-3 bg-main rounded-md border border-standard flex justify-between items-center"
              >
                <span
                  className="text-secondary font-medium cursor-pointer hover:text-primary"
                  onClick={() => handleLocationClick(loc.id)}
                >
                  {loc.name}
                </span>
                <button
                  onClick={() => handleDeleteClick(loc.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Șterge locația"
                >
                  <HiTrash size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary italic">
            Nicio locație înregistrată încă. Adaugă prima locație.
          </p>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmare ștergere"
        message="Ești sigur că vrei să ștergi această locație? Acțiunea este ireversibilă."
      />

      <AddLocationModal
        accountId={businessId}
        show={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
