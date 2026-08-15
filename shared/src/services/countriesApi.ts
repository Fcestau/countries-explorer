import { BASE_URL, PAGE_LIMIT, RESPONSE_FIELDS } from '../constants/api';
import type { RawCountriesResponse, RawCountry } from '../types/country';

export interface FetchAllCountriesOptions {
  apiKey: string;
  /** Fetch options merged into every request, e.g. Next.js `{ next: { revalidate } }`. */
  requestInit?: Record<string, unknown>;
}

export async function fetchAllCountries({
  apiKey,
  requestInit,
}: FetchAllCountriesOptions): Promise<RawCountry[]> {
  const countries: RawCountry[] = [];
  let offset = 0;
  let more = true;

  while (more) {
    const url = `${BASE_URL}?response_fields=${RESPONSE_FIELDS}&limit=${PAGE_LIMIT}&offset=${offset}`;
    const response = await fetch(url, {
      ...requestInit,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(requestInit?.headers as Record<string, string> | undefined),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as RawCountriesResponse;
    countries.push(...json.data.objects);
    more = json.data.meta.more;
    offset += PAGE_LIMIT;
  }

  return countries;
}
