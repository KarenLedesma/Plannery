// Contrato para generar el resumen del viaje con IA (F5).
// Los datos que recibe NUNCA incluyen información personal del usuario.
export interface DatosResumen {
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  moneda: string;
  itinerario: { fecha: string; actividades: string[] }[];
  gastos: { categoria: string; fase: string; estimado: number; real: number | null }[];
}

export interface AiProvider {
  resumir(datos: DatosResumen): Promise<string>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
