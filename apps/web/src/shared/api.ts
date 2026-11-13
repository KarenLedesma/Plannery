// Todas las llamadas al backend pasan por esta función.
// La base es /api: en desarrollo la reenvía el proxy de Vite y en producción la reescritura de Vercel.
// credentials: 'include' hace que el navegador envíe la cookie de sesión en cada pedido.
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface Opciones {
  method?: string
  body?: unknown
}

export async function api<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const res = await fetch(`/api${ruta}`, {
    method: opciones.method ?? 'GET',
    credentials: 'include',
    headers: opciones.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  })

  const datos = await res.json().catch(() => null)

  if (!res.ok) {
    // El backend manda message como texto o como lista (errores de validación)
    const mensaje = Array.isArray(datos?.message) ? datos.message.join('. ') : datos?.message
    throw new ApiError(res.status, mensaje ?? 'Ocurrió un error. Probá de nuevo.')
  }
  return datos as T
}

// Convierte cualquier error en un texto claro para mostrarle a la persona. Lo usan todas las pantallas.
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return 'Revisá los datos ingresados.'
    if (error.status >= 500) return 'El servidor tuvo un problema. Probá de nuevo en unos minutos.'
    return error.message // 401 y 409 ya vienen en español desde el backend
  }
  return 'No se pudo conectar con el servidor. Probá de nuevo.'
}
