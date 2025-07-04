import { useState } from "react";
import { Spinner, Alert } from "flowbite-react";
import ProfileHeader from "../business/ProfileHeader";

import { useLocations } from "../../../hooks/useLocation";

export default function LocationProfilePage() {
  const { locationDetails: location } = useLocations();
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title={`Profil Locație: ${location!!.name}`}
        subtitle={location!!.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-2 space-y-8"></div>
        <div className="md:col-span-1 space-y-8">
          {location ? (
            <></>
          ) : (
            <div className="text-center p-8">
              <Spinner size="xl" />
            </div>
          )}

          {isRefreshing && (
            <Alert color="info" className="mt-4">
              Actualizare în curs...
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
