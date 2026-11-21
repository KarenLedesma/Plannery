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

export interface Destino {
  id: string
  nombre: string
  slug: string
}

// Lo que se manda al backend al crear o editar
export interface DatosActividad {
  destinoId: string
  nombre: string
  tipo: TipoActividad
  descripcion: string | null
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

export function listarDestinos() {
  return api<Destino[]>('/destinos')
}

export function crearActividad(datos: DatosActividad) {
  return api<Actividad>('/actividades', { method: 'POST', body: datos })
}

export function actualizarActividad(id: string, datos: DatosActividad) {
  return api<Actividad>(`/actividades/${id}`, { method: 'PATCH', body: datos })
}

// El backend responde "eliminada" o "archivada" (si la actividad ya está en un itinerario)
export function eliminarActividad(id: string) {
  return api<{ id: string; accion: 'eliminada' | 'archivada' }>(`/actividades/${id}`, {
    method: 'DELETE',
  })
}