// Contrato para traer lugares desde una fuente externa y cargarlos al catálogo (F3).
// Hoy: datos abiertos de la Ciudad de Buenos Aires. Para otra ciudad, otra fuente.
export interface LugarExterno {
  fuente: string;
  fuenteId: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  relevadoEn?: string; // AAAA-MM-DD
}

export interface CatalogSource {
  obtenerLugares(): Promise<LugarExterno[]>;
}

export const CATALOG_SOURCE = Symbol('CATALOG_SOURCE');
