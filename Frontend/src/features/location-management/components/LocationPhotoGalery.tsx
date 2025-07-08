import { useState } from "react";
import { Button, Spinner, TextInput, Label } from "flowbite-react";
import { Trash2 } from "lucide-react";
import { uploadFileToObjectStorage } from "../../../lib/objectStorage/objectStorageApi";
import { useLocations } from "../hooks/useLocation";
import { ConfirmationModal } from "../../../components/common/ConfirmationModel";
import type { LocationDetails, PhotoCreateRequest } from "../../../types/api";

type Props = {
  location: LocationDetails;
};

export default function LocationPhotoGallery({ location }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);

  const { addPhoto, deletePhoto, isProcessing } = useLocations(
    location.business.id,
    location.id
  );

  const resetForm = () => {
    setSelectedFile(null);
    setDescription("");
    setIsUploading(false);
    const input = document.getElementById(
      "photo-upload-input"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadResponse = await uploadFileToObjectStorage(selectedFile);
      const photoUrl = uploadResponse.data.url;

      const photoData: PhotoCreateRequest = {
        url: photoUrl,
        description: description || undefined,
      };

      addPhoto(
        {
          params: {
            path: {
              locationId: location.id!,
              businessAccountId: location.business.id!,
            },
          },
          body: photoData,
        },
        {
          onSettled: resetForm,
        }
      );
    } catch (error) {
      console.error("Eroare la încărcarea fotografiei:", error);
      setIsUploading(false);
    }
  };

  const openDeleteModal = (photoId: number) => {
    setPhotoToDelete(photoId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (photoToDelete === null) return;
    try {
      await deletePhoto({
        params: {
          path: {
            locationId: location.id!,
            businessAccountId: location.business.id!,
            photoId: photoToDelete,
          },
        },
      });
    } catch (error) {
      console.error("Eroare la ștergerea imaginii:", error);
    } finally {
      setIsModalOpen(false);
      setPhotoToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Galerie Foto</h3>

      {/* Formular încărcare fotografie */}
      <form
        onSubmit={handleUploadPhoto}
        className="p-4 border rounded-lg space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Label htmlFor="photo-upload-input">Încarcă fotografie</Label>
          <input
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || isProcessing}
            className="flex-grow"
            title="Selectează o fotografie de încărcat"
            placeholder="Alege fișier imagine"
          />
        </div>

        {selectedFile && (
          <div>
            <Label htmlFor="description">Descriere (opțional)</Label>
            <TextInput
              id="description"
              type="text"
              placeholder="Ex: Terenul principal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>
        )}

        <Button type="submit" disabled={!selectedFile || isUploading}>
          {isUploading ? (
            <>
              <Spinner size="sm" /> <span className="pl-2">Se încarcă...</span>
            </>
          ) : (
            "Încarcă Fotografie"
          )}
        </Button>
      </form>

      {/* Galeria foto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {location.photos?.length ? (
          location.photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.photoUrl}
                alt={photo.description || "Fotografie locație"}
                className="w-full h-48 object-cover rounded-lg shadow"
              />
              {photo.isPrimary && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Principală
                </span>
              )}
              <button
                type="button"
                onClick={() => openDeleteModal(photo.id!)}
                className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded shadow hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Șterge
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Nicio fotografie adăugată.</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmare ștergere"
        message="Ești sigur că vrei să ștergi această imagine? Acțiunea este ireversibilă."
      />
    </div>
  );
}
