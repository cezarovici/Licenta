// src/components/business/DeleteProfileSection.tsx
import { Button, Spinner } from "flowbite-react";

interface DeleteProfileSectionProps {
  onDelete: () => void;
  isSubmitting: boolean;
}

export default function DeleteProfileSection({
  onDelete,
  isSubmitting,
}: DeleteProfileSectionProps) {
  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <h3 className="font-semibold text-xl text-heading mb-3">
        Șterge Profilul
      </h3>
      <p className="text-sm text-secondary mb-4">
        Această acțiune este ireversibilă și va șterge permanent toate datele
        asociate.
      </p>
      <Button
        color="failure"
        onClick={onDelete}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" light={true} className="mr-2" /> Se șterge...
          </>
        ) : (
          "Șterge definitiv profilul"
        )}
      </Button>
    </div>
  );
}
