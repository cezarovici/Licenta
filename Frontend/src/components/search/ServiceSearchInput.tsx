import { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useDebounce } from "use-debounce";

interface ServiceSearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export default function ServiceSearchInput({
  onSearch,
  isSearching,
}: ServiceSearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <TextInput
      id="service-search"
      type="text"
      icon={HiSearch}
      placeholder="Ex: Teren de fotbal, Yoga, Antrenor personal..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      disabled={isSearching}
      required
    />
  );
}
