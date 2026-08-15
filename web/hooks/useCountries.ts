"use client";

import { useQuery } from "@tanstack/react-query";
import type { Country } from "shared";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch("/api/countries");
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }
      return (await response.json()) as Country[];
    },
    // El dataset de países es prácticamente estático: evita refetch innecesario.
    staleTime: Infinity,
  });
}
