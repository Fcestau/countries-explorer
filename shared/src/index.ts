export type { Country, RawCountriesResponse, RawCountry } from './types/country';
export { BASE_URL, PAGE_LIMIT, RESPONSE_FIELDS } from './constants/api';
export { SEARCH_DEBOUNCE_MS } from './constants/ui';
export { mapRawCountriesToCountries, mapRawCountryToCountry } from './mappers/countryMapper';
export type { FetchAllCountriesOptions } from './services/countriesApi';
export { fetchAllCountries } from './services/countriesApi';
export { debounce } from './utils/debounce';
export { filterCountriesByName } from './utils/filterCountries';
export { getLocalizedCountryName } from './utils/getLocalizedCountryName';
export { formatPopulation } from './utils/formatPopulation';

// Fuente única de verdad de los textos de la UI (EN/ES). La configuración de
// i18n (detección de idioma, persistencia) es platform-specific y vive en
// cada app; acá solo se comparten los JSON de traducciones.
export { default as en } from './i18n/locales/en.json';
export { default as es } from './i18n/locales/es.json';
