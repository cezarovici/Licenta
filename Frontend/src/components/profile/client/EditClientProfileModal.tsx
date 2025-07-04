import { Modal, ModalHeader, ModalBody, Alert } from "flowbite-react";
import ClientProfileEditForm from "./ClientProfileEditForm";
import type { ClientProfile } from "../../../lib/profile/clientProfile";

interface EditClientProfileModalProps {
  show: boolean;
  onClose: () => void;
  profile: ClientProfile;
  onSave: (formData: Partial<ClientProfile>) => Promise<void>;
  isSaving: boolean;
  errorMessage: string | null;
}

export default function EditClientProfileModal({
  show,
  onClose,
  profile,
  onSave,
  isSaving,
  errorMessage,
}: EditClientProfileModalProps) {
  return (
    <Modal show={show} onClose={onClose} popup>
      <ModalHeader>Editează Profilul</ModalHeader>
      <ModalBody>
        {errorMessage && (
          <Alert color="failure" className="mb-4">
            {errorMessage}
          </Alert>
        )}
        <ClientProfileEditForm
          profile={profile}
          onSave={onSave}
          onCancel={onClose}
          isSaving={isSaving}
        />
      </ModalBody>
    </Modal>
  );
}
