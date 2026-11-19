import type { Viaje, CrearViajeDto, ItinerarioDia, CrearItinerarioDto } from './tipos';

// Los tipos viven en tipos.ts. Se re-exportan acá para no romper los imports que ya existen.
export type { Viaje, CrearViajeDto, ItinerarioDia, CrearItinerarioDto } from './tipos';

const API_BASE = '/api';

export const listarViajes = async (): Promise<Viaje[]> => {
  const res = await fetch(`${API_BASE}/viajes`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al listar viajes');
  return res.json();
};

export const crearViaje = async (dto: CrearViajeDto): Promise<Viaje> => {
  const res = await fetch(`${API_BASE}/viajes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al crear viaje');
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
  if (!res.ok) throw new Error('Error al crear itinerario');
  return res.json();
};
