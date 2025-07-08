import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  TextInput,
  Button,
} from "flowbite-react";
import { useLocations } from "../../hooks/useLocation";

// Am adăugat `show` și `onClose` ca props pentru a controla vizibilitatea modalului din exterior
export default function AddLocationModal({
  accountId,
  show,
  onClose,
}: {
  accountId: number;
  show: boolean;
  onClose: () => void;
}) {
  const { createLocation } = useLocations(accountId);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const locationData = {
      name,
      address,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      businessId: accountId,
    };

    try {
      createLocation({
        params: {
          path: {
            businessAccountId: accountId,
          },
        },
        body: locationData,
      });
      onClose();
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error("A apărut o eroare la adăugarea locației:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} popup size="lg">
      <ModalHeader>Adaugă Detalii Locație</ModalHeader>
      <ModalBody>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="locationName">
              "Numele Locației (ex: Teren Fotbal Copou)"
            </Label>
            <TextInput
              id="locationName"
              placeholder="Nume locație"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">"Adresa"</Label>
            <TextInput
              id="address"
              placeholder="Str. Exemplului, Nr. 10, Iași"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="latitude">Latitudine (Opțional)</Label>
              <TextInput
                id="latitude"
                type="number"
                step="any" // Permite numere zecimale
                placeholder="47.1732"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitudine (Opțional)</Label>
              <TextInput
                id="longitude"
                type="number"
                step="any" // Permite numere zecimale
                placeholder="27.5722"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <Button type="submit">Adaugă Locație</Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
