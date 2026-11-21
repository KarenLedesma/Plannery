export interface ItinerarioDia {
  id: string;
  actividadId: string;
  fecha: string;
  nota?: string;
}

export interface CrearItinerarioDto {
  actividadId: string;
  fecha: string;
  nota?: string;
}

const API_BASE = '/api';

// Usa el mensaje que manda el backend; si no hay, el texto por defecto
async function errorDe(res: Response, porDefecto: string) {
  const datos = await res.json().catch(() => null);
  const mensaje = Array.isArray(datos?.message) ? datos.message.join('. ') : datos?.message;
  return new Error(mensaje ?? porDefecto);
}

export const listarItinerario = async (viajeId: string): Promise<ItinerarioDia[]> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/itinerario`, {
    credentials: 'include',
  });
  if (!res.ok) throw await errorDe(res, 'Error al listar el itinerario');
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
  if (!res.ok) throw await errorDe(res, 'Error al agregar ítem al itinerario');
  return res.json();
};