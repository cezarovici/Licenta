import {
  Modal,
  Spinner,
  Alert,
  Button,
  FloatingLabel,
  ModalHeader,
  ModalBody,
  Textarea,
  FileInput,
  Label,
} from "flowbite-react";
import { useState } from "react";
import type { LocationCreatePayload } from "../../../types/api";

interface LocationDetailModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: LocationCreatePayload) => void;
  isSubmitting: boolean;
  statusMessage: { type: "success" | "failure"; message: string } | null;
}

export default function LocationDetailModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  statusMessage,
}: LocationDetailModalProps) {
  const [formData, setFormData] = useState<LocationCreatePayload>();

  return (
    <Modal show={show} onClose={onClose} popup size="lg">
      {" "}
      {/* Am mărit modalul */}
      <ModalHeader>Adaugă Detalii Locație</ModalHeader>
      <ModalBody></ModalBody>
    </Modal>
  );
}
