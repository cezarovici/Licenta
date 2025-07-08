import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { PhotoItem } from "./PhotoItem";

export default function BusinessPhotosList({
  accountId,
}: {
  accountId: number;
}) {
  const { allBusinessPhotos: photos } = useBusinessProfile(accountId);

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
          <PhotoItem key={photo.id} photo={photo as Required<typeof photo>} />
        ))}
      </div>
    </div>
  );
}
