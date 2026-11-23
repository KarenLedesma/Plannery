import { ApiError, mensajeDeError } from '../../shared/api'

export const dinero = (n: number) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`

// "2026-11-22T00:00:00.000Z" -> "22/11/2026" (sin pasar por Date, para evitar corrimientos de zona horaria)
export const formatearFecha = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')

// Para los errores de validación (400) se muestra el detalle que manda el backend
export function textoDeError(error: unknown) {
  if (error instanceof ApiError && error.status === 400) return error.message
  return mensajeDeError(error)
}
