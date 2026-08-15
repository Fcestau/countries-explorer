export const BASE_URL = 'https://api.restcountries.com/countries/v5';

/**
 * v5 exige elegir campos explícitamente (equivalente al `fields` de v3.1).
 * Solo pedimos lo que la UI necesita: nombre, código, bandera, capital, población y región.
 */
export const RESPONSE_FIELDS = [
  'names.common',
  'names.official',
  'codes.alpha_3',
  'flag.url_svg',
  'flag.url_png',
  'flag.description',
  'capitals.name',
  'capitals.attributes.primary',
  'population',
  'region',
].join(',');

/** Máximo permitido en el free tier; minimiza la cantidad de páginas necesarias. */
export const PAGE_LIMIT = 100;
