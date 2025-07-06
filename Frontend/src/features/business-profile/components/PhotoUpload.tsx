import { useState } from "react";
import { Button, FileInput, HelperText, Label, Spinner } from "flowbite-react";

const uploadFileToStorageService = async (file: File): Promise<string> => {
  console.log(`Începe upload-ul pentru: ${file.name}`);
  // Simulează o întârziere de rețea de 1.5 secunde
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const publicUrl = `https://storage.example.com/photos/${Date.now()}-${file.name}`;
  console.log(`Fișier încărcat. URL public: ${publicUrl}`);

  return publicUrl;
};

interface PhotoUploadProps {
  onUpload: () => void;
  isSubmitting: boolean;
}

export default function PhotoUpload({
  onUpload,
  isSubmitting,
}: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Te rog selectează un fișier mai întâi.");
      return;
    }

    try {
      // Pas 1: Încarcă fișierul pe un serviciu de stocare și obține URL-ul
      const imageUrl = await uploadFileToStorageService(file);

      // Pas 2: Apelează funcția din hook-ul părinte cu datele necesare
      onUpload();

      // Pas 3: Resetează formularul după succes
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("A apărut o eroare la încărcarea fișierului:", error);
      // Notă: Mesajul de eroare pentru utilizator va fi afișat de componenta globală
      // StatusAlert din pagina principală, deoarece hook-ul va prinde eroarea.
    }
  };

  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <h3 className="font-semibold text-xl text-heading mb-4">
        Adaugă o Imagine Nouă
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file-upload" aria-label="Selectează imaginea" />
          <FileInput
            id="file-upload"
            onChange={handleFileChange}
            value={file ? undefined : ""}
          />
          <HelperText className="mt-1">
            SVG, PNG, JPG or GIF (MAX. 800x400px).
          </HelperText>
        </div>
        <div>
          <Label htmlFor="description" aria-label="Descriere (opțional)" />
          <textarea
            id="description"
            name="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 text-white"
            placeholder="O scurtă descriere a imaginii"
          />
        </div>

        {/* MODIFICAT: Folosim `isSubmitting` din props */}
        <Button
          type="submit"
          disabled={!file || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Se încarcă...</span>
            </>
          ) : (
            "Încarcă Imaginea"
          )}
        </Button>
      </form>
    </div>
  );
}
