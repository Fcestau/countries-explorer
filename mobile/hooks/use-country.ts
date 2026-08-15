import { useCountries } from './use-countries';

/**
 * Reusa la query de useCountries (misma queryKey): si la lista ya está en cache
 * (navegación normal), no dispara ningún fetch extra. Si es un deep link en frío
 * a /country/[id], React Query hace el fetch completo igual que la lista.
 */
export function useCountry(uuid: string | undefined) {
  const { data, isPending, isError, refetch } = useCountries();
  const country = data?.find((item) => item.uuid === uuid);

  return { country, isPending, isError, refetch };
}
