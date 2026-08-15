import type { Country, RawCountry } from '../types/country';

const NO_CAPITAL_FALLBACK = 'N/A';

function pickCapitalName(capitals: RawCountry['capitals']): string {
  if (!capitals || capitals.length === 0) {
    return NO_CAPITAL_FALLBACK;
  }
  const primary = capitals.find((capital) => capital.attributes?.primary);
  return (primary ?? capitals[0])!.name;
}

export function mapRawCountryToCountry(raw: RawCountry): Country {
  return {
    id: raw.codes.alpha_3,
    uuid: raw.uuid,
    name: raw.names.common,
    nameEs: raw.names.translations?.spa?.common ?? raw.names.common,
    officialName: raw.names.official,
    capital: pickCapitalName(raw.capitals),
    population: raw.population,
    region: raw.region,
    flagSvg: raw.flag.url_svg,
    flagPng: raw.flag.url_png,
    flagAlt: raw.flag.description ?? raw.names.common,
  };
}

export function mapRawCountriesToCountries(rawCountries: RawCountry[]): Country[] {
  return rawCountries.map(mapRawCountryToCountry);
}
