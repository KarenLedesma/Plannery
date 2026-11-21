export interface ItinerarioDia {
  id: string;
  actividadId: string;
  fecha: string;
  notas?: string;
}

export interface CrearItinerarioDto {
  actividadId: string;
  fecha: string;
  notas?: string;
}

const API_BASE = '/api';

export const listarItinerario = async (viajeId: string): Promise<ItinerarioDia[]> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al listar el itinerario');
  return res.json();
};

export const crearItinerario = async (
  viajeId: string,
  dto: CrearItinerarioDto
): Promise<ItinerarioDia> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al agregar ítem al itinerario');
  return res.json();
};