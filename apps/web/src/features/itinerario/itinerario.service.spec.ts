import { describe, it, expect, beforeEach, vi } from 'vitest'
import { listarItinerario, crearItinerario } from './itinerario.service'

describe('itinerario service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should call listarItinerario with correct API path', () => {
    const spy = vi.spyOn(require('../../shared/api'), 'get')
    listarItinerario('test-itinerario-id')
    expect(spy).toHaveBeenCalledWith('/api/viajes/test-itinerario-id/itinerario')
    spy.mockRestore()
  })

  it('should call crearItinerario with correct API path and dto', () => {
    const spy = vi.spyOn(require('../../shared/api'), 'post')
    crearItinerario('test-viaje-id', { actividadId: 'act-123', fecha: '2024-01-01' })
    expect(spy).toHaveBeenCalledWith('/api/viajes/test-viaje-id/itinerario', {
      actividadId: 'act-123',
      fecha: '2024-01-01',
    })
    spy.mockRestore()
  })
})