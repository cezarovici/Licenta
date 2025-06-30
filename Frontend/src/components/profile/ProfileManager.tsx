import ProfilePlaceholder from "./ProfilePlaceholder";
import ClientProfileCard from "./client/ClientProfileCard";
import BusinessProfilePage from "./business/BusinessProfilePage";
import { useUserType } from "../../hooks/useUserType";

export default function ProfileManager() {
  const { userType, loading, error } = useUserType();

  if (loading) {
    return <ProfilePlaceholder loading={true} error="" />;
  }

  if (error || userType === null) {
    console.log(error);
    return (
      <ProfilePlaceholder
        loading={false}
        error={error || "User type not identified or not authenticated."}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-990 flex items-center justify-center p-4">
      {userType === "CLIENT" && <ClientProfileCard />}
      {userType === "BUSINESS" && <BusinessProfilePage />}
    </div>
  );
}
