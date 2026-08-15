import { getLocalizedCountryName } from './getLocalizedCountryName';
import type { Country } from '../types/country';

const spain: Country = {
  id: 'ESP',
  uuid: 'uuid-esp',
  name: 'Spain',
  nameEs: 'España',
  officialName: 'Kingdom of Spain',
  capital: 'Madrid',
  population: 47351567,
  region: 'Europe',
  flagSvg: '',
  flagPng: '',
  flagAlt: '',
};

describe('getLocalizedCountryName', () => {
  it('returns the Spanish name when the language is "es"', () => {
    expect(getLocalizedCountryName(spain, 'es')).toBe('España');
  });

  it('returns the English common name for any other language', () => {
    expect(getLocalizedCountryName(spain, 'en')).toBe('Spain');
    expect(getLocalizedCountryName(spain, 'fr')).toBe('Spain');
  });
});
