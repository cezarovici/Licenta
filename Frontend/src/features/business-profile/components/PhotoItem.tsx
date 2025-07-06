import type { BusinessPhoto } from "../../../types/api";

interface PhotoItemProps {
  photo: BusinessPhoto;
}

export function PhotoItem({ photo }: PhotoItemProps) {
  return (
    <>
      {" "}
      <div className="relative group rounded-lg shadow-md overflow-hidden">
        <img
          src={photo.photoUrl}
          alt={photo.description || "Imagine business"}
          className="w-full h-auto"
        />
        {photo.description && (
          <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
            {photo.description}
          </p>
        )}
      </div>
    </>
  );
}
