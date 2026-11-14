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

const API_BASE = '/api';

export const listarItinerario = async (viajeId: string): Promise<ItinerarioItem[]> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al listar itinerario');
  return res.json();
};

export const crearItinerarioItem = async (
  viajeId: string,
  dto: CrearItinerarioDto
): Promise<ItinerarioItem> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al crear itinerario');
  return res.json();
};

export const actualizarItinerarioItem = async (
  viajeId: string,
  itemId: string,
  dto: ActualizarItinerarioDto
): Promise<ItinerarioItem> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al actualizar itinerario');
  return res.json();
};

export const eliminarItinerarioItem = async (viajeId: string, itemId: string) => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar itinerario');
};