# Countries Explorer

Monorepo con una app **mobile** (Expo / React Native, foco principal) y una **web companion** (Next.js), ambas consumiendo la API pública [REST Countries](https://restcountries.com) para listar, buscar y ver el detalle de países.

## Stack y versiones

| | Versión usada |
|---|---|
| Node | v22.16.0 |
| npm | 11.4.1 |
| Expo SDK | 54 (`expo ~54.0.35`, `react-native 0.81.5`) |
| Next.js | 16.3.1 (App Router) |

Requisito: **Expo Go** en el celular debe ser la build correspondiente al SDK 54 (si tu Expo Go es más viejo, la app no va a abrir — actualizalo desde la store).

## 1. Conseguir una API key

Este proyecto usa **REST Countries v5** (`api.restcountries.com`), no v3.1: v1–v4 quedaron deprecadas y v5 exige autenticación.

1. Creá una cuenta gratis en [restcountries.com/docs/api-versions](https://restcountries.com/docs/api-versions) (free tier: 500 requests/mes).
2. Copiá tu API key.

## 2. Instalación

Desde la raíz del repo:

```bash
npm install
```

Esto instala las dependencias de `shared/`, `mobile/` y `web/` de una (npm workspaces).

## 3. Variables de entorno

Copiá los `.env.example` de cada app y completá la key que conseguiste en el paso 1. **Nunca se commitean** (están en `.gitignore`).

**`web/.env`** (server-only, nunca llega al bundle del browser):
```bash
cp web/.env.example web/.env
```
```
RESTCOUNTRIES_API_KEY=tu_key_aca
```

**`mobile/.env`**:
```bash
cp mobile/.env.example mobile/.env
```
```
EXPO_PUBLIC_RESTCOUNTRIES_API_KEY=tu_key_aca
```

> ⚠️ **Trade-off asumido**: en mobile la key queda con el prefijo `EXPO_PUBLIC_`, lo que significa que Expo la inyecta directo en el bundle JS del cliente — es visible para cualquiera que inspeccione la app instalada. Es una limitación inherente de no tener servidor propio en mobile; en web sí evitamos esto (ver sección de decisiones técnicas).

## 4. Correr las apps

**Mobile** (con Expo Go en el celular, mismo Wi-Fi que la compu):
```bash
npm run mobile
# o: cd mobile && npx expo start
```
Escaneá el QR con Expo Go.

**Web**:
```bash
npm run web
# o: cd web && npm run dev
```
Abre en [http://localhost:3000](http://localhost:3000).

## 5. Tests

```bash
npm test
```

Corre los tests de `shared/` (mapper, formatter, filtro, paginación) y `mobile/` (estados de UI) en todos los workspaces. Sin la API key configurada como variable de entorno, el test de integración contra la API real (`shared/src/services/countriesApi.integration.test.ts`) se **salta automáticamente** — el resto no depende de red.

Para correrlo también (opcional, valida contra datos reales):
```bash
cd shared && RESTCOUNTRIES_API_KEY=tu_key npx jest countriesApi.integration
```

## Estructura del proyecto

```
countries-explorer/
├── shared/          # tipos, servicio de API, mapper, formatters, filtro, debounce — sin dependencias de runtime
├── mobile/          # Expo Router: app/index.tsx (lista) + app/country/[id].tsx (detalle)
└── web/             # Next.js App Router: app/page.tsx (lista) + app/country/[id]/page.tsx (detalle)
```

## Decisiones técnicas

| Decisión | Detalle |
|---|---|
| **API v5, no v3.1** | v1–v4 de REST Countries están deprecadas. v5 vive en `api.restcountries.com`, exige `Authorization: Bearer <key>` y pagina los resultados (máx. 100/página en el free tier). `shared/src/services/countriesApi.ts` pagina automáticamente hasta agotar `meta.more`. |
| **Key oculta en web, expuesta en mobile** | El route handler `web/app/api/countries/route.ts` hace el fetch a REST Countries **server-side** (la key nunca llega al browser) y cachea la respuesta 24h. El cliente web solo pega a `/api/countries`, mismo origen. Mobile no tiene backend propio, así que la key queda en el bundle (ver trade-off arriba). |
| **`uuid` como identificador, no `cca3`** | 4 de 254 países/territorios (Abjasia, Chipre del Norte, Somalilandia, Osetia del Sur) no tienen código ISO alpha-3. El `uuid` que devuelve la API sí está siempre presente, así que se usa como `key` de listas (`FlatList`/`.map`) y como parámetro de la ruta dinámica `/country/[id]` en ambas apps. |
| **Búsqueda bilingüe** | La API expone `names.translations.spa.common` (nombre en español). `Country.nameEs` lo guarda con fallback al nombre en inglés si no hay traducción. `filterCountriesByName` matchea contra ambos nombres, sin acentos ni mayúsculas. En mobile, el nombre mostrado también cambia según el idioma activo (`getLocalizedCountryName`). |
| **Regiones traducidas, pero fijas** | Las 6 regiones posibles (`Africa`, `Americas`, `Antarctic`, `Asia`, `Europe`, `Oceania`) se traducen con claves i18n propias de mobile (`regions.*`), no vienen de la API — es contenido estático de la app. |
| **PNG en listas, SVG en detalle (mobile)** | Las banderas SVG de REST Countries no traen `viewBox`, así que `SvgUri` las recortaba en vez de escalarlas al pedir un tamaño distinto al original. `mobile/components/country-flag.tsx` trae el XML a mano y le inyecta un `viewBox` derivado de su propio `width`/`height` antes de renderizarlo con `SvgXml`. Para la lista se usa PNG (más liviano, sin este problema) vía `expo-image`. Si falta la bandera o falla la carga, se muestra un placeholder. |
| **React Query, `staleTime: Infinity`** | El dataset de países es estático dentro de una sesión: se pide una sola vez y se cachea. Mobile y web reusan la misma query key (`['countries']`) entre la lista y el detalle — si ya visitaste la lista, el detalle no vuelve a pedir nada. |
| **Debounce compartido** | `shared/src/utils/debounce.ts` es un debounce framework-agnostic (sin dependencia de React). Cada app lo envuelve en su propio hook (`useDebouncedValue`) porque un hook necesita React, y `shared` se mantiene sin dependencias de runtime. |
| **Sin paginación / sin estado global** | El dataset (~254 países) es chico y fijo: un solo fetch + filtrado en memoria alcanza. No hay Zustand/Context porque no hay estado compartido que lo justifique. |
| **Copia única de React en mobile** | En este monorepo, `mobile/package.json` fija la versión exacta de React que espera Expo SDK 54, pero otras dependencias hoisteadas por npm (p. ej. `expo-router`) podían resolver una copia distinta (la que pide `web/`). Eso generaba dos instancias de React en el mismo bundle de Metro y rompía los hooks internos. `mobile/metro.config.js` fuerza `react` a resolver siempre desde `mobile/node_modules/react`. |

## Qué lógica se comparte (`shared/`)

- **Tipos**: `RawCountry` (shape de la API), `Country` (modelo de dominio).
- **Servicio**: `fetchAllCountries` — pagina contra REST Countries v5.
- **Mapper**: `mapRawCountryToCountry(s)` — de `RawCountry` a `Country`, con fallbacks (capital `N/A`, nombre en español = nombre en inglés si no hay traducción).
- **Utils**: `filterCountriesByName` (búsqueda bilingüe, sin acentos), `formatPopulation` (`Intl.NumberFormat`), `debounce`, `getLocalizedCountryName`.
- **Constantes**: `BASE_URL`, `RESPONSE_FIELDS`, `PAGE_LIMIT`, `SEARCH_DEBOUNCE_MS`.

Mobile y web importan todo esto desde `shared` — cero lógica de dominio duplicada entre plataformas. Lo que **no** se comparte (por decisión, no por descuido) son los componentes de UI: los patrones de React Native y de la web son distintos, así que cada app tiene los suyos (`CountryCard`, `SearchBar`, `LoadingState`, `EmptyState`, `ErrorState` existen en ambas carpetas, pero son implementaciones independientes).

## Trade-offs asumidos

- **API key visible en el bundle de mobile**: inevitable sin un backend propio (ver sección 3). Documentado, no oculto.
- **Free tier de 500 requests/mes**: mitigado con `staleTime: Infinity` en React Query (un solo fetch por sesión) y caché de 24h en el route handler de web.
- **`uuid` en vez de `cca3` en las URLs**: las rutas de detalle son menos legibles (`/country/0e1bae13-...` en vez de `/country/ESP`), pero es la única forma de que los 4 territorios sin código ISO tengan una página de detalle funcional.
- **Sin dark mode en web**: se fijó un tema claro único (fondo gris `#f2f2f2` + cards blancas) después de detectar que el esquema adaptativo original hacía que algunas banderas (blancas o muy oscuras) se perdieran contra el fondo en modo oscuro.
