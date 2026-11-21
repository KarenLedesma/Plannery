export interface Viaje {
  id: string;
  nombre: string;
  destinoId: string;
  destino?: {
    id: string;
    nombre: string;
    slug?: string;
  };
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  moneda?: string;
  estado?: string;
}

export interface CrearViajeDto {
  nombre: string;
  destinoId: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
}

export interface ItinerarioDia {
  id: string;
  actividadId: string;
  fecha: string;
  notas?: string;
}

export interface CrearItinerarioDto {
  actividadId: string;
  fecha: string;
}