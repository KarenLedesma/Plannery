const API_BASE = '/api';

export type ProveedorIa = 'gemini' | 'openai' | 'groq';

export interface IaConfigResponse {
  configurada: boolean;
  proveedor: ProveedorIa;
  ultimos4: string | null;
  actualizadoEn: string | null;
}

export interface GuardarIaConfigDto {
  proveedor: ProveedorIa;
  apiKey: string;
}

export interface ResumenViajeResponse {
  viajeId: string;
  proveedor: ProveedorIa;
  resumen: string;
  generadoEn: string;
}

async function extraerError(res: Response, fallback: string): Promise<string> {
  const err = await res.json().catch(() => null);
  if (Array.isArray(err?.message)) return err.message.join(', ');
  return err?.message || fallback;
}

export const obtenerIaConfig = async (): Promise<IaConfigResponse> => {
  const res = await fetch(`${API_BASE}/ia/config`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await extraerError(res, 'Error al consultar la configuración de IA'));
  return res.json();
};

export const guardarIaConfig = async (dto: GuardarIaConfigDto): Promise<IaConfigResponse> => {
  const res = await fetch(`${API_BASE}/ia/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await extraerError(res, 'Error al guardar la API Key'));
  return res.json();
};

export const eliminarIaConfig = async (): Promise<void> => {
  const res = await fetch(`${API_BASE}/ia/config`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await extraerError(res, 'Error al eliminar la API Key'));
};

export const generarResumenViaje = async (viajeId: string): Promise<ResumenViajeResponse> => {
  const res = await fetch(`${API_BASE}/viajes/${viajeId}/resumen`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await extraerError(res, 'No se pudo generar el resumen del viaje'));
  return res.json();
};