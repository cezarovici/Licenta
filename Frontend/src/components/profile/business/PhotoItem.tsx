import { useState } from "react";
import { Button, Spinner } from "flowbite-react";
import type { BusinessPhoto } from "../../../types/api";
import { useBusinessProfile } from "../../../hooks/useBusinessProfile";
import { ConfirmationModal } from "../../common/ConfirmationModel";

interface PhotoItemProps {
  photo: BusinessPhoto;
  onDeleted: (photoId: number) => void;
}

export function PhotoItem({ photo, onDeleted }: PhotoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // --- 2. Adaugă starea pentru controlul modalului ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { deletePhoto } = useBusinessProfile();

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    setError(null);
    try {
      deletePhoto(photo.id);
      onDeleted(photo.id);
    } catch (e) {
      setError("Eroare la ștergerea imaginii.");
    } finally {
      setIsDeleting(false);
    }
  };

  const imageUrl = `http://localhost:8888/uploads/${encodeURIComponent(
    photo.photoUrl
  )}`;

  return (
    <>
      {" "}
      <div className="relative group rounded-lg shadow-md overflow-hidden">
        <img
          src={imageUrl}
          alt={photo.description || "Imagine business"}
          className="w-full h-auto"
        />
        {photo.description && (
          <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
            {photo.description}
          </p>
        )}
        <Button
          size="xs"
          color="failure"
          // --- 5. Butonul acum doar deschide modalul ---
          onClick={() => setIsModalOpen(true)}
          disabled={isDeleting}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isDeleting ? <Spinner size="xs" /> : "Șterge"}
        </Button>
        {error && (
          <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
        )}
      </div>
      {/* --- 6. Randează modalul și pasează-i props-urile necesare --- */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmare ștergere"
        message="Ești sigur că vrei să ștergi această imagine? Acțiunea este ireversibilă."
      />
    </>
  );
}
