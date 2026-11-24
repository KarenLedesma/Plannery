import { api } from '../../shared/api'
import type { Recomendaciones } from './tipos'

export function obtenerRecomendaciones(viajeId: string) {
  return api<Recomendaciones>(`/viajes/${viajeId}/recomendaciones`)
}

// Quita una actividad del itinerario (DELETE /viajes/:viajeId/itinerario/:itemId)
export function quitarDelItinerario(viajeId: string, itemId: string) {
  return api<unknown>(`/viajes/${viajeId}/itinerario/${itemId}`, { method: 'DELETE' })
}