import { useState, useEffect } from "react";
import { Button, Label, TextInput, Spinner, Textarea } from "flowbite-react";
import { HiPencil, HiCheck, HiX } from "react-icons/hi";
import type {
  BusinessProfile,
  BusinessUpdatePayload,
} from "../../../types/api";

interface BusinessProfileDisplayProps {
  profile: BusinessProfile;
  isSubmitting: boolean;
  onUpdateProfile: (updatedData: BusinessUpdatePayload) => void;
}

export default function BusinessProfileDisplay({
  profile,
  isSubmitting,
  onUpdateProfile,
}: BusinessProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<BusinessUpdatePayload>({
    name: profile.name,
    logoUrl: profile.logoUrl,
    description: profile.description,
    websiteUrl: profile.websiteUrl,
    phoneNumber: profile.phoneNumber,
    email: profile.email,
  });

  useEffect(() => {
    setFormData({
      name: profile.name,
      logoUrl: profile.logoUrl,
      description: profile.description,
      websiteUrl: profile.websiteUrl,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
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
            />
          ) : (
            renderField(profile.description, "Nu a fost adăugată o descriere.")
          )}
        </div>

        {/* Logo URL */}
        <div>
          <Label
            htmlFor="logoUrl"
            className="text-primary mb-2 block font-semibold"
          >
            URL Logo
          </Label>
          {isEditing ? (
            <TextInput
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl || ""}
              onChange={handleChange}
              placeholder="https://.../logo.png"
            />
          ) : profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt="Logo Business"
              className="max-w-24 h-auto rounded-md bg-white p-1"
            />
          ) : (
            <p className="text-gray-400 italic">Nu a fost adăugat un logo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
