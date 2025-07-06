import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BusinessProfilePage from "../../../features/business-profile/BusinessProfilePage";

const queryClient = new QueryClient();

export default function ProfilePageProvider() {
  // Componenta returnează pagina ta principală, dar învelită în provider.
  return (
    <QueryClientProvider client={queryClient}>
      <BusinessProfilePage />
    </QueryClientProvider>
  );
}
