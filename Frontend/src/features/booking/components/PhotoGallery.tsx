import React from "react";
import { Spinner } from "flowbite-react";
import { useLocations } from "../../location-management/hooks/useLocation";

interface Props {
  locationId: number;
  businessId: number;
}

export const LocationPhotoGallery: React.FC<Props> = ({
  locationId,
  businessId,
}) => {
  const { locationDetails, isLoading } = useLocations(businessId, locationId);

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-200 rounded-lg">
        <Spinner />
      </div>
    );
  }

  const images = locationDetails?.photos.map((p) => p.photoUrl) || [];
  if (images.length === 0) return null;

  const [mainImage, ...otherImages] = images;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
      <div className="col-span-2 row-span-2 sm:col-span-1 sm:row-span-2">
        <img
          src={mainImage}
          alt={locationDetails?.name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="hidden sm:grid col-span-1 row-span-2 grid-cols-2 grid-rows-2 gap-4">
        {otherImages.slice(0, 4).map((img, index) => (
          <div key={index} className="w-full h-full">
            <img
              src={img}
              alt={`View ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
