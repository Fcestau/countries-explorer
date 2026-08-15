/** Forma cruda de un país tal como lo devuelve REST Countries v5 (data.objects[i]). */
export interface RawCountry {
  names: {
    common: string;
    official: string;
  };
  codes: {
    alpha_3: string;
  };
  flag: {
    url_svg: string;
    url_png: string;
    description?: string;
  };
  capitals?: Array<{
    name: string;
    attributes?: { primary?: boolean };
  }>;
  population: number;
  region: string;
}

/** Envoltorio de paginación que devuelve v5 en cada página de /countries/v5. */
export interface RawCountriesResponse {
  data: {
    objects: RawCountry[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

/** Modelo de dominio usado por mobile y web, ya normalizado. */
export interface Country {
  id: string;
  name: string;
  officialName: string;
  capital: string;
  population: number;
  region: string;
  flagSvg: string;
  flagPng: string;
  flagAlt: string;
}
