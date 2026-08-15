import type { Country } from '../types/country';

/** Normaliza para comparar sin distinguir mayúsculas ni acentos (NFD + strip diacritics). */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function filterCountriesByName(countries: Country[], query: string): Country[] {
  const normalizedQuery = normalize(query.trim());

  if (!normalizedQuery) {
    return countries;
  }

  return countries.filter((country) => normalize(country.name).includes(normalizedQuery));
}
