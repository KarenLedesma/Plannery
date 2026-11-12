export interface ItinerarioItem {
  id: string;
  actividadId: string;
  fecha: string;
  notas?: string;
  viajeId: string;
}

export interface CrearItinerarioDto {
  actividadId: string;
  fecha: string;
}

export interface ActualizarItinerarioDto {
  actividadId?: string;
  fecha?: string;
  notas?: string;
}