import { api } from '../../shared/api'

export type TipoActividad = 'INTERIOR' | 'EXTERIOR' | 'MIXTA'

export interface Actividad {
  id: string
  destinoId: string
  nombre: string
  descripcion: string | null
  tipo: TipoActividad
  categoria: string | null
  direccion: string | null
  latitud: number | null
  longitud: number | null
  activa: boolean
}

export interface FiltrosCatalogo {
  tipo: TipoActividad | ''
  activa: 'true' | 'false' | ''
}

export function listarActividades(filtros: FiltrosCatalogo) {
  const params = new URLSearchParams()
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.activa) params.set('activa', filtros.activa)
  const consulta = params.toString()
  return api<Actividad[]>(`/actividades${consulta ? `?${consulta}` : ''}`)
}

// El backend responde "eliminada" o "archivada" (si la actividad ya está en un itinerario)
export function eliminarActividad(id: string) {
  return api<{ id: string; accion: 'eliminada' | 'archivada' }>(`/actividades/${id}`, {
    method: 'DELETE',
  })
}