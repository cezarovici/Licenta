import type { BusinessPhoto } from "../../../types/api";
import type { components } from "../../../types/api.generated";
import { PhotoItem } from "./PhotoItem";

interface BusinessPhotosListProps {
  photos: BusinessPhoto[];
  onPhotoDeleted: (photoId: number) => void;
}

export default function BusinessPhotosList({
  photos,
  onPhotoDeleted,
}: BusinessPhotosListProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="p-6 bg-section border border-standard rounded-lg text-center">
        <p className="text-secondary italic">Nicio imagine adăugată încă.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <h2 className="font-semibold text-xl text-heading mb-4">
        Imagini Business
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} onDeleted={onPhotoDeleted} />
        ))}
      </div>
    </div>
  );
}
