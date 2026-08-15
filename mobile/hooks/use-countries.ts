import { useQuery } from '@tanstack/react-query';
import { fetchAllCountries, mapRawCountriesToCountries } from 'shared';

const API_KEY = process.env.EXPO_PUBLIC_RESTCOUNTRIES_API_KEY ?? '';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const raw = await fetchAllCountries({ apiKey: API_KEY });
      return mapRawCountriesToCountries(raw);
    },
    // El dataset de países es prácticamente estático: evita refetch innecesario.
    staleTime: Infinity,
  });
}
