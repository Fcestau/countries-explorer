import { fetchAllCountries } from './countriesApi';
import type { RawCountriesResponse, RawCountry } from '../types/country';

function makeRawCountry(id: string): RawCountry {
  return {
    uuid: `uuid-${id}`,
    names: { common: id, official: id },
    codes: { alpha_3: id },
    flag: { url_svg: '', url_png: '' },
    capitals: [{ name: 'Capital', attributes: { primary: true } }],
    population: 1,
    region: 'Europe',
  };
}

function makePage(objects: RawCountry[], more: boolean): RawCountriesResponse {
  return {
    data: {
      objects,
      meta: { total: 2, count: objects.length, limit: 1, offset: 0, more },
    },
  };
}

describe('fetchAllCountries', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('follows pagination until meta.more is false and aggregates every page', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePage([makeRawCountry('AAA')], true),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePage([makeRawCountry('BBB')], false),
      });
    global.fetch = fetchMock as unknown as typeof fetch;

    const countries = await fetchAllCountries({ apiKey: 'test-key' });

    expect(countries.map((c) => c.codes.alpha_3)).toEqual(['AAA', 'BBB']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('sends the API key as a Bearer token', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => makePage([], false),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await fetchAllCountries({ apiKey: 'secret-key' });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>).Authorization).toBe('Bearer secret-key');
  });

  it('throws when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    }) as unknown as typeof fetch;

    await expect(fetchAllCountries({ apiKey: 'bad-key' })).rejects.toThrow('401');
  });
});
