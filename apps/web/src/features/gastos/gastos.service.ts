import { api } from '../../shared/api'
import type { Comparacion, CrearGasto, Gasto } from './tipos'

export function listarGastos(viajeId: string) {
  return api<Gasto[]>(`/viajes/${viajeId}/gastos`)
}

export function crearGasto(viajeId: string, dto: CrearGasto) {
  return api<Gasto>(`/viajes/${viajeId}/gastos`, { method: 'POST', body: dto })
}

// Se usa para cargar el monto real cuando el gasto se hace efectivo
export function actualizarGasto(viajeId: string, gastoId: string, dto: Partial<CrearGasto>) {
  return api<Gasto>(`/viajes/${viajeId}/gastos/${gastoId}`, { method: 'PATCH', body: dto })
}

export function borrarGasto(viajeId: string, gastoId: string) {
  return api<unknown>(`/viajes/${viajeId}/gastos/${gastoId}`, { method: 'DELETE' })
}

export function obtenerComparacion(viajeId: string) {
  return api<Comparacion>(`/viajes/${viajeId}/gastos/comparacion`)
}
