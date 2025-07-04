import { useState, useEffect } from "react";
import { Button, FloatingLabel, Spinner, Textarea } from "flowbite-react";
import type { ClientProfile } from "../../../lib/profile/clientProfile";

interface ClientProfileEditFormProps {
  profile: ClientProfile;
  onSave: (formData: Partial<ClientProfile>) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ClientProfileEditForm({
  profile,
  onSave,
  onCancel,
  isSaving,
}: ClientProfileEditFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatingLabel
          name="firstName"
          label="Prenume"
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <FloatingLabel
          name="lastName"
          label="Nume"
          variant="outlined"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Scrie o scurtă biografie..."
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 text-white"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button color="gray" onClick={onCancel} disabled={isSaving}>
          Anulează
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Se salvează...</span>
            </>
          ) : (
            "Salvează Modificările"
          )}
        </Button>
      </div>
    </form>
  );
}
