import { fetchAllCountries } from './countriesApi';
import { mapRawCountriesToCountries } from '../mappers/countryMapper';

const apiKey = process.env.RESTCOUNTRIES_API_KEY;

/**
 * Pega contra la API real: se salta automáticamente si no hay RESTCOUNTRIES_API_KEY
 * en el entorno (no corre en CI/otras máquinas sin key propia).
 */
const maybeIt = apiKey ? it : it.skip;

describe('fetchAllCountries (live integration)', () => {
  maybeIt(
    'fetches every country from the real API and maps it to the domain shape',
    async () => {
      const raw = await fetchAllCountries({ apiKey: apiKey! });
      const countries = mapRawCountriesToCountries(raw);

      expect(countries.length).toBeGreaterThan(200);

      const spain = countries.find((country) => country.id === 'ESP');
      expect(spain).toBeDefined();
      expect(spain?.name).toBe('Spain');
      expect(spain?.nameEs).toBe('España');
      expect(spain?.capital).toBe('Madrid');
      expect(spain?.flagSvg).toMatch(/^https:\/\//);
      expect(typeof spain?.population).toBe('number');
    },
    30000,
  );
});
