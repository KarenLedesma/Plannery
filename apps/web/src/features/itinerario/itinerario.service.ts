import { api } from '../../shared/api'
import type { CrearItinerarioDto } from '../../viajes/tipos'

export const listarItinerario = (itinerarioId: string) => {
  return api.get(`/api/viajes/${itinerarioId}/itinerario`)
}

export const crearItinerario = (viajeId: string, dto: CrearItinerarioDto) => {
  return api.post(`/api/viajes/${viajeId}/itinerario`, dto)
}