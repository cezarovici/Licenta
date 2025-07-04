import { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  type ClientProfile,
} from "../../../lib/profile/clientProfile";
import ProfilePlaceholder from "../ProfilePlaceholder";
import ProfileHeader from "../business/ProfileHeader";
import ClientProfileDisplay from "./ClientProfileDisplay";
import ClientSettingsSection from "./ClientProfileSettingsSection";
import EditClientProfileModal from "./EditClientProfileModal";

export default function ClientProfileCard() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching client profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenEditModal = () => {
    setSaveError(null);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isSaving) return;
    setEditModalOpen(false);
  };

  const handleSaveProfile = async (formData: Partial<ClientProfile>) => {
    if (!profile) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const updatedProfile = await updateCurrentUserProfile(formData);
      setProfile(updatedProfile);
      setEditModalOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "A apărut o eroare la salvare.";
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ProfileHeader
          title="Profilul Tău"
          subtitle="Vezi și editează detaliile contului tău."
        />
        <ProfilePlaceholder
          loading={loading}
          error={error || (!profile ? "No client profile data." : "")}
        />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ProfileHeader
          title="Profilul Tău"
          subtitle="Vezi și editează detaliile contului tău."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="md:col-span-2">
            <ClientProfileDisplay profile={profile} />
          </div>

          <div className="md:col-span-1 space-y-8">
            <ClientSettingsSection onEditProfileClick={handleOpenEditModal} />
          </div>
        </div>
      </div>

      {profile && (
        <EditClientProfileModal
          show={isEditModalOpen}
          onClose={handleCloseEditModal}
          profile={profile}
          onSave={handleSaveProfile}
          isSaving={isSaving}
          errorMessage={saveError}
        />
      )}
    </>
  );
}
