import {
  Modal,
  Spinner,
  Alert,
  Button,
  FloatingLabel,
  ModalHeader,
  ModalBody,
} from "flowbite-react";

import { useState, useEffect } from "react";
import type { components } from "../../../types/api.generated";

type LocationCreateRequest = components["schemas"]["LocationCreateRequest"];

interface AddLocationModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: LocationCreateRequest) => void;
  isSubmitting: boolean;
  statusMessage: { type: "success" | "failure"; message: string } | null;
}

const INITIAL_FORM_STATE: LocationCreateRequest = {
  name: "",
  address: "",
  latitude: undefined,
  longitude: undefined,
};

export default function AddLocationModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  statusMessage,
}: AddLocationModalProps) {
  const [formData, setFormData] =
    useState<LocationCreateRequest>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (show) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onClose={onClose} popup>
      <ModalHeader>Adaugă o Locație Nouă</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <FloatingLabel
              id="name"
              name="name"
              label="Nume Locație"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <FloatingLabel
              id="address"
              name="address"
              label="Adresă"
              variant="outlined"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingLabel
                id="latitude"
                name="latitude"
                label="Latitudine (Opțional)"
                type="number"
                variant="outlined"
                value={formData.latitude ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FloatingLabel
                id="longitude"
                name="longitude"
                label="Longitudine (Opțional)"
                type="number"
                variant="outlined"
                value={formData.longitude ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {statusMessage && (
            <Alert
              color={statusMessage.type === "success" ? "success" : "failure"}
            >
              {statusMessage.message}
            </Alert>
          )}

          <div className="flex justify-end space-x-4">
            <Button color="gray" onClick={onClose} disabled={isSubmitting}>
              Anulează
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Se adaugă...</span>
                </>
              ) : (
                "Adaugă Locația"
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
