import { api } from '../../shared/api'
import type { Recomendaciones } from './tipos'

export function obtenerRecomendaciones(viajeId: string) {
  return api<Recomendaciones>(`/viajes/${viajeId}/recomendaciones`)
}