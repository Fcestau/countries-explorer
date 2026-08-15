import { fetchAllCountries } from 'shared';

/**
 * El dataset de países es prácticamente estático, así que cacheamos esta ruta
 * (y la request upstream) por 24h para no gastar el free tier de restcountries.com.
 */
export const revalidate = 86400;

export async function GET() {
  const apiKey = process.env.RESTCOUNTRIES_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'RESTCOUNTRIES_API_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  try {
    const rawCountries = await fetchAllCountries({
      apiKey,
      requestInit: { next: { revalidate: 86400 } },
    });
    return Response.json(rawCountries);
  } catch {
    return Response.json(
      { error: 'Failed to fetch countries from the upstream API.' },
      { status: 502 },
    );
  }
}
