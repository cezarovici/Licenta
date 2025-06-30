import { Spinner, Alert } from "flowbite-react";
import { useBusinessProfile } from "../../../hooks/useBusinessProfile";

import ProfileHeader from "./ProfileHeader";
import BusinessProfileDisplay from "./BusinessProfileDisplay";
import BusinessLocationsList from "./BusinessLocationsList";
import DeleteProfileSection from "./ProfileDeleteSection";
import StatusAlert from "./StatusAlert";

export default function BusinessProfilePage() {
  const { profile, isSubmitting, statusMessage } = useBusinessProfile();
  console.log(profile);

  const handleAddLocation = () => {
    console.log(
      "Navighează pentru a adăuga o locație nouă sau deschide un modal."
    );
  };

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4 text-heading">
          Niciun profil de business găsit.
        </h2>
        <p className="text-secondary">
          Poți crea unul sau verifică dacă ești autentificat.
        </p>
        {isSubmitting && (
          <div className="flex justify-center my-4">
            <Spinner size="lg" />
          </div>
        )}
        {statusMessage && statusMessage.type === "error" && (
          <Alert color="failure" className="mt-4 max-w-sm mx-auto">
            {statusMessage.message}
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title="Profilul Tău de Business"
        subtitle="Vizualizează detaliile și gestionează locațiile."
      />

      <StatusAlert statusMessage={statusMessage} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <BusinessProfileDisplay profile={profile} accountId={0} />
        </div>

        <div className="md:col-span-1 space-y-8">
          {/* Lista de locații */}
          <BusinessLocationsList
            locations={profile.locations || []}
            accountId={1}
            onAddLocation={handleAddLocation}
          />

          {/* Secțiunea de ștergere a profilului */}
          <DeleteProfileSection
            onDelete={() => {}}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
