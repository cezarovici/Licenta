import type { LocationSummary } from "../../types/api";
import SearchResultItem from "./SearchResultItem";

interface ServiceSearchResultsProps {
  results: LocationSummary[];
  hasSearched: boolean;
}

export default function ServiceSearchResults({
  results,
  hasSearched,
}: ServiceSearchResultsProps) {
  if (hasSearched && results.length === 0) {
    return (
      <div className="text-center p-8 bg-section border border-standar`d rounded-lg">
        <h3 className="text-xl font-semibold text-heading">
          Niciun rezultat găsit
        </h3>
        <p className="text-secondary mt-2">
          Încearcă să folosești alți termeni de căutare sau să verifici dacă ai
          scris corect.
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center p-8 bg-section border border-standard rounded-lg">
        <h3 className="text-xl font-semibold text-heading">Caută o locație</h3>
        <p className="text-secondary mt-2">
          Folosește bara de căutare de mai sus pentru a găsi săli de sport sau
          terenuri.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <SearchResultItem key={result.id} result={result} />
      ))}
    </div>
  );
}
