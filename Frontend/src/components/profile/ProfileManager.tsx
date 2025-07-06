import { useUserType } from "../../hooks/useUserType";
import BusinessProfilePage from "../../features/business-profile/BusinessProfilePage";
import ClientProfileCard from "./client/ClientProfileCard";
import ProfilePlaceholder from "./ProfilePlaceholder";

export default function ProfileManager() {
  const { userType, loading, error } = useUserType();

  if (loading) {
    return <ProfilePlaceholder loading={true} error="" />;
  }

  if (error || !userType) {
    return (
      <ProfilePlaceholder
        loading={false}
        error={
          error ||
          "Tipul de utilizator nu a fost identificat sau nu sunteți autentificat."
        }
      />
    );
  }

  return (
    <div className="w-full">
      {userType === "CLIENT" && <ClientProfileCard />}
      {userType === "BUSINESS" && <BusinessProfilePage />}
    </div>
  );
}
