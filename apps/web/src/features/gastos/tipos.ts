// Mismos valores que el backend (gastos.dto.ts)
export const CATEGORIAS = ['TRANSPORTE', 'ALOJAMIENTO', 'COMIDA', 'ACTIVIDADES', 'OTROS'] as const
export const FASES = ['ANTES', 'DURANTE', 'DESPUES'] as const

export type Categoria = (typeof CATEGORIAS)[number]
export type Fase = (typeof FASES)[number]

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  TRANSPORTE: 'Transporte',
  ALOJAMIENTO: 'Alojamiento',
  COMIDA: 'Comida',
  ACTIVIDADES: 'Actividades',
  OTROS: 'Otros',
}

export const ICONO_CATEGORIA: Record<Categoria, string> = {
  TRANSPORTE: '🚌',
  ALOJAMIENTO: '🏨',
  COMIDA: '🍽️',
  ACTIVIDADES: '🎟️',
  OTROS: '🧾',
}

export const ETIQUETA_FASE: Record<Fase, string> = {
  ANTES: 'Antes del viaje',
  DURANTE: 'Durante el viaje',
  DESPUES: 'Después del viaje',
}

export interface Gasto {
  id: string
  viajeId: string
  descripcion: string
  categoria: Categoria
  fase: Fase
  montoEstimado: number
  montoReal: number | null
  fecha: string | null
  nota: string | null
}

export interface CrearGasto {
  descripcion: string
  categoria: Categoria
  fase: Fase
  montoEstimado: number
  montoReal?: number | null
  fecha?: string
  nota?: string
}

export interface Linea {
  estimado: number
  real: number
  diferencia: number
}

export interface Comparacion {
  moneda: string
  presupuesto: number
  total: Linea
  disponible: number
  porCategoria: (Linea & { categoria: Categoria })[]
  porFase: (Linea & { fase: Fase })[]
}
