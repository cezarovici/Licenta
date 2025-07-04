import { useUserType } from "../../hooks/useUserType";
import BusinessProfilePage from "./business/BusinessProfilePage";
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

  // Acum, în funcție de userType, randăm componenta corespunzătoare.
  // Ambele componente vor avea acces la QueryClient deoarece părintele
  // (AppProvider) le-a oferit contextul.
  return (
    <div className="w-full">
      {userType === "CLIENT" && <ClientProfileCard />}
      {userType === "BUSINESS" && <BusinessProfilePage />}
    </div>
  );
}
