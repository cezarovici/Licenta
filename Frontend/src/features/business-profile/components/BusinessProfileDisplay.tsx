import { useState, useEffect } from "react";
import {
  Button,
  Label,
  TextInput,
  Spinner,
  Textarea,
  FileInput,
} from "flowbite-react";
import { HiPencil, HiCheck, HiX } from "react-icons/hi";
import type { BusinessUpdatePayload } from "../../../types/api";
import { uploadFileToObjectStorage } from "../../../lib/objectStorage/objectStorageApi";
import { useBusinessProfile } from "../hooks/useBusinessProfile";

export default function BusinessProfileDisplay({
  accountId,
}: {
  accountId: number;
}) {
  const {
    profile: profile2,
    updateProfile,
    isSubmitting,
  } = useBusinessProfile(accountId);
  const profile = profile2!;

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<BusinessUpdatePayload>({
    name: profile.name,
    logoUrl: profile.logoUrl,
    description: profile.description,
    websiteUrl: profile.websiteUrl,
    phoneNumber: profile.phoneNumber,
    email: profile.email,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile.logoUrl || null
  );

  console.log("Profilul de business:", profile);

  useEffect(() => {
    setFormData({
      name: profile.name,
      logoUrl: profile.logoUrl,
      description: profile.description,
      websiteUrl: profile.websiteUrl,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
    });
    setLogoPreview(profile.logoUrl || null);
    setLogoFile(null);
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, logoUrl: "" }));
    }
  };

  const handleSave = async () => {
    let dataToSave = { ...formData };
    console.log("Date de salvat:", dataToSave);

    if (logoFile) {
      setIsUploading(true);
      try {
        const newLogoUrl = await uploadFileToObjectStorage(logoFile);
        dataToSave.logoUrl = newLogoUrl.data.url;
        console.log("Logo URL actualizat:", dataToSave.logoUrl);
      } catch (error) {
        console.error("Eroare la încărcarea logo-ului:", error);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    updateProfile(dataToSave);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      logoUrl: profile.logoUrl,
      description: profile.description,
      websiteUrl: profile.websiteUrl,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
    });
    setLogoFile(null);
    setLogoPreview(profile.logoUrl || null);
    setIsEditing(false);
  };

  const renderField = (
    value: string | undefined | null,
    placeholder: string
  ) => {
    return value ? (
      <p className="text-text-color">{value}</p>
    ) : (
      <p className="text-gray-400 italic">{placeholder}</p>
    );
  };

  const isBusy = isUploading || isSubmitting;

  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl text-heading">
          Detalii Business
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isBusy}
                color="success"
                size="sm"
              >
                {isBusy ? (
                  <Spinner size="sm" />
                ) : (
                  <HiCheck className="h-5 w-5" />
                )}
                <span className="ml-2 hidden sm:inline">
                  {isUploading ? "Se încarcă logo..." : "Salvează"}
                </span>
              </Button>
              <Button
                onClick={handleCancel}
                color="gray"
                disabled={isBusy}
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

      <div className="space-y-6">
        {/* Nume și Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="name"
              className="text-primary mb-2 block font-semibold"
            >
              Nume Business
            </Label>
            {isEditing ? (
              <TextInput
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                disabled={isBusy}
              />
            ) : (
              renderField(profile.name, "Numele afacerii")
            )}
          </div>
          <div>
            <Label
              htmlFor="websiteUrl"
              className="text-primary mb-2 block font-semibold"
            >
              Website
            </Label>
            {isEditing ? (
              <TextInput
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl || ""}
                onChange={handleChange}
                placeholder="https://..."
                disabled={isBusy}
              />
            ) : (
              renderField(profile.websiteUrl, "Nu a fost adăugat")
            )}
          </div>
        </div>

        {/* Email și Telefon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="email"
              className="text-primary mb-2 block font-semibold"
            >
              Email Contact
            </Label>
            {isEditing ? (
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="contact@business.com"
                disabled={isBusy}
              />
            ) : (
              renderField(profile.email, "Nu a fost adăugat")
            )}
          </div>
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-primary mb-2 block font-semibold"
            >
              Telefon
            </Label>
            {isEditing ? (
              <TextInput
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="07XX XXX XXX"
                disabled={isBusy}
              />
            ) : (
              renderField(profile.phoneNumber, "Nu a fost adăugat")
            )}
          </div>
        </div>

        {/* Descriere */}
        <div>
          <Label
            htmlFor="description"
            className="text-primary mb-2 block font-semibold"
          >
            Descriere
          </Label>
          {isEditing ? (
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              placeholder="O scurtă descriere a afacerii tale..."
              disabled={isBusy}
            />
          ) : (
            renderField(profile.description, "Nu a fost adăugată o descriere.")
          )}
        </div>

        {/* Logo */}
        <div>
          <Label
            htmlFor="logo"
            className="text-primary mb-2 block font-semibold"
          >
            Logo
          </Label>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Previzualizare Logo"
                  className="h-24 w-24 rounded-md bg-white p-1 object-contain border"
                />
              )}
              <FileInput
                id="logo"
                name="logo"
                onChange={handleFileChange}
                disabled={isBusy}
                className="flex-grow"
              />
            </div>
          ) : profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt="Logo Business"
              className="max-w-24 h-auto rounded-md bg-white p-1"
            />
          ) : (
            renderField(null, "Nu a fost adăugat un logo.")
          )}
        </div>
      </div>
    </div>
  );
}
