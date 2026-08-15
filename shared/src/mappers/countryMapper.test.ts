import { mapRawCountryToCountry } from './countryMapper';
import type { RawCountry } from '../types/country';

const rawSpain: RawCountry = {
  uuid: 'cb089fe4-e471-4136-ae28-6db2b9059f48',
  names: {
    common: 'Spain',
    official: 'Kingdom of Spain',
    translations: { spa: { common: 'España', official: 'Reino de España' } },
  },
  codes: { alpha_3: 'ESP' },
  flag: {
    url_svg: 'https://flags.restcountries.com/v5/es.svg',
    url_png: 'https://flags.restcountries.com/v5/w320/es.png',
    description: 'Three horizontal bands of red, yellow and red, with the national coat of arms',
  },
  capitals: [{ name: 'Madrid', attributes: { primary: true } }],
  population: 47351567,
  region: 'Europe',
};

describe('mapRawCountryToCountry', () => {
  it('maps a raw country to the domain Country shape', () => {
    expect(mapRawCountryToCountry(rawSpain)).toEqual({
      id: 'ESP',
      uuid: 'cb089fe4-e471-4136-ae28-6db2b9059f48',
      name: 'Spain',
      nameEs: 'España',
      officialName: 'Kingdom of Spain',
      capital: 'Madrid',
      population: 47351567,
      region: 'Europe',
      flagSvg: 'https://flags.restcountries.com/v5/es.svg',
      flagPng: 'https://flags.restcountries.com/v5/w320/es.png',
      flagAlt: 'Three horizontal bands of red, yellow and red, with the national coat of arms',
    });
  });

  it('falls back to the common name when there is no Spanish translation', () => {
    const rawWithoutTranslation: RawCountry = {
      ...rawSpain,
      names: { common: 'Spain', official: 'Kingdom of Spain' },
    };

    expect(mapRawCountryToCountry(rawWithoutTranslation).nameEs).toBe('Spain');
  });

  it('falls back to N/A when the country has no capital', () => {
    const rawAntarctica: RawCountry = {
      ...rawSpain,
      names: { common: 'Antarctica', official: 'Antarctica' },
      capitals: undefined,
      codes: { alpha_3: 'ATA' },
    };

    expect(mapRawCountryToCountry(rawAntarctica).capital).toBe('N/A');
  });

  it('picks the capital flagged as primary when there is more than one', () => {
    const rawWithMultipleCapitals: RawCountry = {
      ...rawSpain,
      capitals: [
        { name: 'Secondary Capital' },
        { name: 'Main Capital', attributes: { primary: true } },
      ],
    };

    expect(mapRawCountryToCountry(rawWithMultipleCapitals).capital).toBe('Main Capital');
  });

  it('falls back to the common name when flag.description is missing', () => {
    const rawWithoutFlagDescription: RawCountry = {
      ...rawSpain,
      flag: { url_svg: rawSpain.flag.url_svg, url_png: rawSpain.flag.url_png },
    };

    expect(mapRawCountryToCountry(rawWithoutFlagDescription).flagAlt).toBe('Spain');
  });
});
