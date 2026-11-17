export type TipoDia = 'BUENO' | 'LLUVIOSO' | 'EXTREMO'
export type TipoActividad = 'INTERIOR' | 'EXTERIOR' | 'MIXTA'

export interface ActividadRecomendada {
  id: string
  nombre: string
  descripcion: string | null
  tipo: TipoActividad
  direccion: string | null
}

export interface DiaRecomendado {
  fecha: string
  clima: { tempMax: number; tempMin: number; probLluvia: number; tipoDia: TipoDia }
  actividades: ActividadRecomendada[]
}

export interface Recomendaciones {
  viajeId: string
  destino: string
  dias: DiaRecomendado[]
  sinPronostico: string[]
}