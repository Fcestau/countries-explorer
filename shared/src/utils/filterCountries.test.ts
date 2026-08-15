import { filterCountriesByName } from './filterCountries';
import type { Country } from '../types/country';

function makeCountry(overrides: Partial<Country>): Country {
  return {
    id: 'XXX',
    name: 'Placeholder',
    officialName: 'Placeholder',
    capital: 'N/A',
    population: 0,
    region: 'Europe',
    flagSvg: '',
    flagPng: '',
    flagAlt: '',
    ...overrides,
  };
}

const countries: Country[] = [
  makeCountry({ id: 'ESP', name: 'Spain' }),
  makeCountry({ id: 'PER', name: 'Peru' }),
  makeCountry({ id: 'FRA', name: 'France' }),
];

describe('filterCountriesByName', () => {
  it('filters case-insensitively', () => {
    expect(filterCountriesByName(countries, 'spain').map((c) => c.id)).toEqual(['ESP']);
  });

  it('filters ignoring accents/diacritics on the query', () => {
    expect(filterCountriesByName(countries, 'perú').map((c) => c.id)).toEqual(['PER']);
  });

  it('returns all countries for an empty or blank query', () => {
    expect(filterCountriesByName(countries, '')).toHaveLength(3);
    expect(filterCountriesByName(countries, '   ')).toHaveLength(3);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterCountriesByName(countries, 'zzz')).toEqual([]);
  });
});
