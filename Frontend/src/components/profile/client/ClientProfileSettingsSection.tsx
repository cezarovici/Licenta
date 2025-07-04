import { Button } from "flowbite-react";

export default function ClientSettingsSection() {
  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <h3 className="font-semibold text-xl text-heading mb-4">Setări</h3>
      <div className="flex flex-col gap-4">
        <Button
          color="primary"
          onClick={() =>
            alert("Funcționalitatea de 'Editare Profil' va fi adăugată.")
          }
        >
          Editare Profil
        </Button>
        <Button
          color="alternative"
          onClick={() =>
            alert("Funcționalitatea de 'Setări Cont' va fi adăugată.")
          }
        >
          Setări Cont
        </Button>
      </div>
    </div>
  );
}
