# Countries Explorer — Especificación técnica

## 1\. Problema / Necesidad

Desarrollar una aplicación cross-platform llamada **Countries Explorer** como prueba técnica. Consta de dos aplicaciones que consumen la API pública REST Countries:

1. **App mobile (foco principal)** construida con Expo / React Native.  
2. **Web companion simple** construida con Next.js.

Ambas deben permitir: listar países, buscar por nombre, ver el detalle de un país (nombre, bandera, capital, población, región) y manejar estados de UI reales (loading, empty, error con retry). La app mobile debe además soportar al menos inglés y español.

El objetivo de evaluación es: estructura de proyecto escalable, consumo de APIs externas, manejo de estados de UI, decisiones técnicas pragmáticas y reutilización de lógica entre mobile y web. **Se valora una solución simple, estable y bien estructurada por encima de una ambiciosa pero inestable. Evitar over-engineering.**

## 2\. Contexto

- La app mobile es la parte principal y debe recibir la mayor parte del esfuerzo.  
- La web debe ser intencionalmente simple: lista \+ búsqueda \+ info básica del país \+ estados de UI. Sin i18n (opcional, no lo implementamos en v1).  
- No se comparten componentes de UI entre mobile y web (los patrones de RN y web son distintos). Se comparte lógica de dominio: tipos, servicios de API, mappers, formatters y constantes.  
- No se levanta ningún backend propio: ambas apps consumen REST Countries directamente desde el cliente. La API es pública, sin autenticación y sin restricciones de CORS, por lo que un BFF sería sobre-ingeniería.  
- API: `https://restcountries.com/v3.1`  
  - **Importante:** el endpoint `/all` exige el parámetro `fields` (sin él responde 400). Usar: `GET /v3.1/all?fields=name,flags,capital,population,region,cca3`  
  - Identificador único de país: `cca3`.

## 3\. Decisiones técnicas tomadas

| Decisión | Elección | Justificación |
| :---- | :---- | :---- |
| Monorepo | **npm workspaces** con `mobile/`, `web/`, `shared/` | Simple, sin tooling extra (sin Turborepo/Nx), suficiente para el alcance |
| Lenguaje | **TypeScript estricto** en los tres paquetes | Requisito obligatorio |
| Server state | **TanStack Query (React Query)** en mobile y web | Maneja loading/error/cache de forma estructurada; cubre el extra valorado de "API request caching" |
| Estado local | useState para el término de búsqueda; sin Zustand/Context global | La app no tiene estado compartido complejo; agregar más sería over-engineering |
| Búsqueda | **Filtrado local**: un solo fetch a `/all` y filtrado en memoria por nombre | \~250 países es un dataset chico; evita requests por tecleo; la lista completa queda cacheada por React Query |
| Debounce | Debounce de **300 ms** sobre el input de búsqueda (hook `useDebounce` en `shared/` o util compartida) | Requisito del enunciado; con filtrado local no evita requests pero sí re-renders innecesarios del FlatList |
| Navegación mobile | **Expo Router**: `app/index.tsx` (lista) y `app/country/[id].tsx` (detalle, ruta dinámica con `cca3`) | Requisito |
| i18n mobile | **react-i18next** \+ `expo-localization` (detección inicial de idioma del dispositivo) \+ **AsyncStorage** (persistencia del idioma elegido) | Cubre requisito \+ extras valorados; idioma se mantiene durante la navegación |
| Banderas | **SVG** con `react-native-svg` (`SvgUri` apuntando a `flags.svg` de la API) en mobile; `next/image` con `flags.png`/`flags.svg` en web | El uso de SVG es bonus según el enunciado |
| Listado mobile | **FlatList** con `keyExtractor={(item) => item.cca3}` | Requisito |
| Resultados grandes | Limitación básica: `initialNumToRender` \+ `windowSize` ajustados en FlatList; sin paginación completa | El dataset es fijo (\~250 items); paginación real sería artificial |
| Performance | `React.memo` en el item de lista (`CountryCard`), callbacks memoizados | Extra valorado |
| Accesibilidad | `accessibilityLabel` y `accessibilityRole` en Pressables, touch targets ≥ 44pt | Extra valorado |
| Web | **Next.js App Router** \+ **Tailwind CSS** \+ React Query en componentes `"use client"` | Requisitos; fetching en cliente para mantener consistencia con mobile y mostrar estados de UI |
| Tests | **Jest \+ Testing Library** | Ver sección 5 |
| HTTP client | `fetch` nativo (funciona igual en RN y web, sin dependencia extra) | Pragmatismo |

## 4\. Librerías a utilizar

**shared/**

- Sin dependencias de runtime (solo TypeScript). Exporta tipos, servicios (fetch), mappers, formatters y constantes.

**mobile/**

- `expo` (SDK actual estable), `expo-router`, `expo-localization`  
- `@tanstack/react-query`  
- `react-i18next`, `i18next`  
- `@react-native-async-storage/async-storage`  
- `react-native-svg` (render de banderas SVG remotas)  
- Dev: `jest-expo`, `@testing-library/react-native`

**web/**

- `next` (App Router), `react`, `react-dom`  
- `@tanstack/react-query`  
- `tailwindcss`  
- Dev: `jest`, `@testing-library/react`, `jest-environment-jsdom`

## 5\. Estructura del proyecto

countries-explorer/

├── package.json               \# workspaces: \["mobile", "web", "shared"\]

├── shared/

│   ├── src/

│   │   ├── types/country.ts          \# RawCountry (API) y Country (dominio)

│   │   ├── services/countriesApi.ts  \# fetchAllCountries()

│   │   ├── mappers/countryMapper.ts  \# RawCountry \-\> Country

│   │   ├── utils/formatPopulation.ts \# Intl.NumberFormat

│   │   ├── utils/filterCountries.ts  \# filtrado por nombre (case/diacritics-insensitive)

│   │   └── constants/api.ts          \# BASE\_URL, FIELDS

│   └── package.json

├── mobile/

│   ├── app/

│   │   ├── \_layout.tsx        \# QueryClientProvider \+ i18n init \+ selector idioma

│   │   ├── index.tsx          \# lista \+ búsqueda

│   │   └── country/\[id\].tsx   \# detalle

│   ├── src/

│   │   ├── components/        \# CountryCard, SearchBar, LoadingState, EmptyState, ErrorState, LanguageSwitcher

│   │   ├── hooks/             \# useCountries, useCountry, useDebounce

│   │   └── i18n/              \# config \+ locales/en.json \+ locales/es.json

│   └── package.json

└── web/

    ├── app/

    │   ├── layout.tsx         \# Providers (React Query)

    │   ├── page.tsx           \# lista \+ búsqueda \+ detalle simple

    │   └── country/\[id\]/page.tsx  \# (o detalle inline en la lista, mantener simple)

    ├── src/components/

    └── package.json

## 6\. Comportamiento esperado (detalle funcional)

### Mobile

- **Lista (`app/index.tsx`)**: al abrir, fetch de todos los países (React Query, `staleTime` alto porque el dataset es estático). Muestra `CountryCard` con bandera, nombre y región. SearchBar arriba con debounce de 300 ms; filtra localmente (insensible a mayúsculas y acentos).  
- **Detalle (`app/country/[id].tsx`)**: recibe `cca3` por parámetro de ruta. Obtiene el país desde la cache de React Query (o re-fetch si no está). Muestra bandera grande, nombre, capital, población formateada, región. Botón/gesto de volver.  
- **Estados de UI**: loading (spinner/skeleton), empty ("no results found" traducido), error (mensaje claro \+ botón retry que llama a `refetch`).  
- **i18n**: EN y ES. Todos los textos estáticos traducidos. Selector de idioma visible (header). Idioma inicial: el del dispositivo (expo-localization); si el usuario cambia, se persiste en AsyncStorage y se restaura al reabrir. El idioma se mantiene al navegar entre pantallas.

### Web

- Una página con: input de búsqueda (mismo debounce compartido), grilla/lista de países con bandera \+ nombre \+ capital \+ población \+ región, estados loading/empty/error con retry. Detalle simple (página dinámica o panel expandible — elegir lo más simple). Tailwind para estilos. Sin i18n.

## 7\. Tests (Jest \+ Testing Library)

Mínimo requerido (elegir estos, son significativos y baratos):

1. **`shared/mappers/countryMapper.test.ts`**: mapea un `RawCountry` de ejemplo al tipo `Country` (incluye caso de país sin capital → fallback).  
2. **`shared/utils/formatPopulation.test.ts`** y/o **`filterCountries.test.ts`**: formateo de números y filtrado insensible a acentos.  
3. **Mobile**: test de un estado de UI — p. ej. `ErrorState` renderiza el mensaje y dispara `onRetry` al presionar, o `EmptyState` visible cuando la búsqueda no matchea.

## 8\. Fases de implementación

Implementar en este orden. **Cada fase termina en un estado ejecutable y verificable** — no avanzar a la siguiente hasta validar el checkpoint de la actual.

### Fase 0 — Scaffolding del monorepo (\~20 min)

- Crear raíz con `package.json` (workspaces), `.gitignore`, `shared/` con `tsconfig` estricto.  
- Crear app Expo (`npx create-expo-app` con template TypeScript \+ Expo Router) en `mobile/`.  
- Crear app Next.js (`create-next-app` con TypeScript \+ Tailwind \+ App Router) en `web/`.  
- Conectar `shared` como dependencia de ambas apps.  
- ✅ **Checkpoint:** `npm install` en raíz funciona; `expo start` muestra la pantalla default; `npm run dev` en web muestra la default de Next; ambas apps pueden importar una constante dummy desde `shared` sin errores de TS ni de bundler (Metro y Next resuelven el workspace).

### Fase 1 — Capa shared completa (\~30 min)

- `types/country.ts` (RawCountry \+ Country), `constants/api.ts`, `services/countriesApi.ts`, `mappers/countryMapper.ts`, `utils/formatPopulation.ts`, `utils/filterCountries.ts`, `utils/useDebounce` (o util de debounce framework-agnostic).  
- Tests de mapper, formatter y filtro (sección 7, puntos 1 y 2).  
- ✅ **Checkpoint:** `npm test` pasa en verde; un script temporal o test de integración confirma que `fetchAllCountries()` \+ mapper devuelven países reales bien tipados.

### Fase 2 — Mobile: lista \+ búsqueda (\~45 min)

- `_layout.tsx` con QueryClientProvider.  
- `index.tsx` con `useCountries` (React Query), FlatList \+ `keyExtractor` por `cca3`, `CountryCard` memoizado con bandera SVG, SearchBar con debounce y filtrado local.  
- Estados loading / empty / error con retry (componentes con textos hardcodeados en inglés por ahora).  
- ✅ **Checkpoint:** en el simulador se ve la lista real, la búsqueda filtra (probar con acentos: "españa"), y en modo avión aparece el error con retry funcional.

### Fase 3 — Mobile: detalle \+ navegación (\~30 min)

- `country/[id].tsx`: lee `cca3`, obtiene el país (cache de React Query con fallback a fetch), muestra bandera grande, nombre, capital, población formateada, región. Volver a la lista.  
- Accesibilidad: labels y touch targets en los Pressables.  
- ✅ **Checkpoint:** tap en un país → detalle correcto → volver; deep link directo a `/country/ESP` también funciona (recarga sin pasar por la lista).

### Fase 4 — Mobile: i18n (\~45 min)

- Configurar react-i18next con `locales/en.json` y `locales/es.json`; migrar todos los textos estáticos a claves de traducción.  
- Detección inicial con expo-localization, persistencia con AsyncStorage, `LanguageSwitcher` en el header.  
- Test del estado de UI (sección 7, punto 3), ahora con i18n mockeado o provider de test.  
- ✅ **Checkpoint:** cambiar idioma actualiza toda la UI al instante, se mantiene al navegar lista↔detalle, y persiste tras cerrar y reabrir la app. `npm test` sigue en verde.

### Fase 5 — Web companion (\~45 min)

- Provider de React Query, página con búsqueda (mismo debounce y filtro de `shared`), grilla de países con Tailwind, detalle simple, estados loading/empty/error con retry.  
- ✅ **Checkpoint:** el web muestra los mismos datos que mobile reutilizando servicio/mapper/filtro de `shared` (verificar que no hay lógica duplicada); los tres estados de UI son visibles (throttling de red en DevTools para loading/error).

### Fase 6 — Pulido y entrega (\~30 min)

- README.md completo (sección Delivery del enunciado), revisión de warnings de TS/lint, limpieza de código muerto, verificación del checklist completo de la sección 9\.  
- ✅ **Checkpoint:** un clon fresco del repo, siguiendo solo el README, levanta ambas apps y corre los tests sin pasos extra.

>   
> Nota de Git: cada fase se corresponde naturalmente con una branch \+ PR (ej. `feat/shared-layer`, `feat/mobile-list`), lo que cubre el criterio de "uso de Git" del enunciado.

## 9\. Condiciones de finalización (Definition of Done)

La tarea se considera terminada cuando se cumple TODO lo siguiente:

- [ ] Monorepo con npm workspaces funcionando: `npm install` en la raíz instala todo.  
- [ ] `mobile/` corre con `npx expo start` sin errores ni warnings críticos.  
- [ ] `web/` corre con `npm run dev` sin errores.  
- [ ] Todo el código en TypeScript, sin `any` injustificados, `strict: true`.  
- [ ] Mobile: lista de países reales de la API con FlatList \+ `keyExtractor` por `cca3`.  
- [ ] Mobile: búsqueda con debounce de 300 ms, filtrado local, insensible a mayúsculas/acentos.  
- [ ] Mobile: navegación lista → detalle → volver, con Expo Router y ruta dinámica `[id]`.  
- [ ] Mobile: detalle muestra nombre, bandera (SVG), capital, población formateada y región.  
- [ ] Mobile: estados loading, empty y error (con retry funcional) visibles y probados manualmente (modo avión para error).  
- [ ] Mobile: i18n EN/ES completo en textos estáticos, detección de idioma del dispositivo, persistencia en AsyncStorage, idioma estable durante la navegación.  
- [ ] Web: lista \+ búsqueda con debounce \+ info básica \+ estados loading/empty/error, con Tailwind y App Router.  
- [ ] `shared/` contiene tipos, servicio de API, mapper, formatters y constantes, importados por ambas apps (cero duplicación de esa lógica).  
- [ ] Al menos los tests de la sección 7 pasan con `npm test`.  
- [ ] Accesibilidad básica: labels en Pressables, touch targets adecuados.  
- [ ] `CountryCard` memoizado; sin re-renders innecesarios evidentes.  
- [ ] README.md con: instalación/ejecución de mobile y web, versiones de Node/Expo SDK/Next.js, cómo correr tests, decisiones técnicas, qué lógica se comparte y trade-offs asumidos.  
- [ ] Repo Git limpio: `.gitignore` correcto (sin `node_modules`, sin builds), commits descriptivos, trabajo en branches con PRs coherentes.

## 10\. Fuera de alcance (explícitamente NO hacer)

- Backend propio / BFF / API routes de Next.js como proxy.  
- Paginación completa (el dataset es fijo y chico).  
- i18n en la web.  
- Compartir componentes de UI entre mobile y web.  
- Estado global (Zustand/Context) — no hay estado compartido que lo justifique.  
- Dark mode, animaciones complejas, o cualquier extra no listado en el enunciado.

