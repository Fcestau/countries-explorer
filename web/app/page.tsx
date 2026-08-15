"use client";

import { useMemo, useState } from "react";
import { filterCountriesByName } from "shared";

import { CountryCard } from "@/components/CountryCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { SearchBar } from "@/components/SearchBar";
import { useCountries } from "@/hooks/useCountries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function Home() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const { data, isPending, isError, refetch } = useCountries();

  const filteredCountries = useMemo(
    () => filterCountriesByName(data ?? [], debouncedQuery),
    [data, debouncedQuery],
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Countries Explorer</h1>
        <p className="text-sm text-foreground/70">Browse and search countries from around the world.</p>
      </div>

      <div className="max-w-md">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filteredCountries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCountries.map((country) => (
            <CountryCard key={country.uuid} country={country} />
          ))}
        </div>
      )}
    </main>
  );
}
