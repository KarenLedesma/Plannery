export interface Viaje {
  id: string;
  nombre: string;
  destinoId: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  creadoEn: string;
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