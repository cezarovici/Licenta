import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BusinessProfilePage from "../../../features/business-profile/BusinessProfilePage";

const queryClient = new QueryClient();

export default function ProfilePageProvider(accountId: number) {
  return (
    <QueryClientProvider client={queryClient}>
      <BusinessProfilePage accountId={accountId} />
    </QueryClientProvider>
  );
}
