import { useState, useEffect } from "react";
import { Button, Label, TextInput, Spinner, Textarea } from "flowbite-react";
import { HiPencil, HiCheck, HiX } from "react-icons/hi";
import type {
  ClientProfile,
  UpdateClientProfileDTO as ClientProfileUpdateRequestDTO,
} from "../../../types/api";
import { useClientProfile } from "../../../features/client-profile/hooks/useClientProfile";
import { uploadFileToObjectStorage } from "../../../lib/objectStorage/objectStorageApi";

interface ClientProfileDisplayProps {
  profile: ClientProfile;
  isSubmitting: boolean;
}

export default function ClientProfileDisplay({
  profile,
  isSubmitting,
}: ClientProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClientProfileUpdateRequestDTO>({
    firstName: "",
    lastName: "",
    bio: "",
    profilePhotoUrl: "",
    favoriteSports: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { updateProfile } = useClientProfile(profile.accountId);

  useEffect(() => {
    resetForm();
  }, [profile]);

  const resetForm = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      profilePhotoUrl: profile.profilePhotoUrl,
      favoriteSports: profile.favoriteSports,
    });
    setPreviewUrl(profile.profilePhotoUrl);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Afișează preview imediat
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Încarcă fișierul pe server
      const uploadResponse = await uploadFileToObjectStorage(file);

      // Actualizează URL-ul în formData cu URL-ul de la server
      setFormData((prev) => ({
        ...prev,
        profilePhotoUrl: uploadResponse.data.url,
      }));
    } catch (error) {
      console.error("Eroare la încărcarea imaginii:", error);
      // Opțional: afișează feedback pentru utilizator
    }
  };

  const handleSave = () => {
    updateProfile({
      params: { path: { clientId: profile.accountId } },
      body: formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const renderInputOrText = (
    id: string,
    label: string,
    value: string,
    isTextarea: boolean = false,
    placeholder?: string
  ) => (
    <div>
      <Label htmlFor={id} className="text-primary mb-2 block font-semibold">
        {label}
      </Label>
      {isEditing ? (
        isTextarea ? (
          <Textarea
            id={id}
            name={id}
            value={value || ""}
            onChange={handleChange}
            rows={4}
            placeholder={placeholder}
          />
        ) : (
          <TextInput
            id={id}
            name={id}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className="text-text-color whitespace-pre-wrap">
          {value || (
            <span className="text-gray-400 italic">
              {id === "bio" ? "Nicio biografie adăugată." : "Nespecificat"}
            </span>
          )}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl text-heading">Profilul Meu</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                color="success"
                size="sm"
              >
                {isSubmitting ? (
                  <Spinner size="sm" />
                ) : (
                  <HiCheck className="h-5 w-5" />
                )}
                <span className="ml-2 hidden sm:inline">Salvează</span>
              </Button>
              <Button
                onClick={handleCancel}
                color="gray"
                disabled={isSubmitting}
                size="sm"
              >
                <HiX className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Anulează</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <HiPencil className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Editează</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <img
            src={previewUrl || "default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full border-4 border-standard shadow-lg"
          />
          {isEditing && (
            <div>
              <Label
                htmlFor="photo-upload"
                className="cursor-pointer bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors text-sm"
              >
                Încarcă o poză nouă
              </Label>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInputOrText("firstName", "Prenume", formData.firstName || "")}
          {renderInputOrText("lastName", "Nume", formData.lastName || "")}
        </div>

        {/* Bio */}
        {renderInputOrText(
          "bio",
          "Despre mine (Bio)",
          formData.bio || "",
          true,
          "O scurtă descriere..."
        )}

        {/* Favorite Sports */}
        {renderInputOrText(
          "favoriteSports",
          "Sporturi preferate",
          formData.favoriteSports || "",
          false,
          "Ex: Fotbal, Baschet"
        )}
      </div>
    </div>
  );
}
