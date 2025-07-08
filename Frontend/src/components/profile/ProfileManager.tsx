import { useUserType } from "../../hooks/useUserType";
import BusinessProfilePage from "../../features/business-profile/BusinessProfilePage";
import ClientProfileCard from "./client/ClientProfileCard";
import ProfilePlaceholder from "./ProfilePlaceholder";

export default function ProfileManager() {
  const {
    userType,
    isLoadingUserType: loading,
    errorLoadingUserType: error,
  } = useUserType();

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
      {userType.name === "CLIENT" && (
        <ClientProfileCard accountId={userType.accountId} />
      )}
      {userType.name === "BUSINESS" && (
        <BusinessProfilePage accountId={userType.accountId} />
      )}
    </div>
  );
}
