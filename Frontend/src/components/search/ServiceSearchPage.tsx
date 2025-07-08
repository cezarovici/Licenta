import { useState, useMemo } from "react";
import { Spinner, Alert } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProfileHeader from "../profile/business/ProfileHeader";
import ServiceSearchInput from "./ServiceSearchInput";
import ServiceSearchResults from "./ServiceSeachResults";
import { useLocations } from "../../features/location-management/hooks/useLocation";

const queryClient = new QueryClient();

export default function ServiceSearchPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceSearchPageInternal />
    </QueryClientProvider>
  );
}

function ServiceSearchPageInternal() {
  const [query, setQuery] = useState("");
  const { allLocations, isLoading, statusMessage } = useLocations();

  const filteredResults = (() => {
    if (!query.trim()) {
      return allLocations;
    }
    const lowercasedQuery = query.toLowerCase();
    return allLocations.filter(
      (location) =>
        location.name?.toLowerCase().includes(lowercasedQuery) ||
        location.address?.toLowerCase().includes(lowercasedQuery)
    );
  })();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <ProfileHeader
        title="Găsește o Locație Sportivă"
        subtitle="Caută terenuri sau săli de sport în orașul tău."
      />
      <div className="mt-6">
        <ServiceSearchInput onSearch={setQuery} isSearching={isLoading} />
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="text-center">
            <Spinner size="xl" />
          </div>
        )}

        {statusMessage?.type === "error" && (
          <Alert color="failure">{statusMessage.message}</Alert>
        )}

        {!isLoading && (
          <ServiceSearchResults
            results={filteredResults}
            hasSearched={query.trim().length > 0}
          />
        )}
      </div>
    </div>
  );
}
