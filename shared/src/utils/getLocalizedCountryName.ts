import type { Country } from '../types/country';

/**
 * languageCode es un string genérico (no atado al tipo de idiomas soportados
 * de mobile) para que shared no dependa de nada específico de una app.
 */
export function getLocalizedCountryName(country: Country, languageCode: string): string {
  return languageCode === 'es' ? country.nameEs : country.name;
}
