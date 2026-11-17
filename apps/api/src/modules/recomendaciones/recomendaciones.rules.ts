import { TipoActividad } from '@prisma/client';
import { PronosticoDia } from '../../integrations/clima/weather-provider.interface';

export type TipoDia = 'BUENO' | 'LLUVIOSO' | 'EXTREMO';

// Umbrales de la regla. Se ajustan acá y en ningún otro lugar.
export const UMBRAL_LLUVIA = 50; // % de probabilidad desde el cual el día es lluvioso
export const CALOR_EXTREMO = 32; // °C de máxima
export const FRIO_EXTREMO = 8; // °C de máxima

// El clima extremo se evalúa primero: con 35 °C y lluvia no queremos recomendar un lugar mixto.
export function clasificarDia(dia: PronosticoDia): TipoDia {
  if (dia.tempMax >= CALOR_EXTREMO || dia.tempMax < FRIO_EXTREMO) return 'EXTREMO';
  if (dia.probLluvia >= UMBRAL_LLUVIA) return 'LLUVIOSO';
  return 'BUENO';
}

// ¿Conviene esta actividad en un día así?
export function conviene(tipo: TipoActividad, dia: TipoDia): boolean {
  if (tipo === 'INTERIOR') return true;
  if (tipo === 'MIXTA') return dia !== 'EXTREMO';
  return dia === 'BUENO'; // EXTERIOR
}

// Orden de las recomendaciones: lo más adecuado para el clima primero.
export function prioridad(tipo: TipoActividad, dia: TipoDia): number {
  const preferidas: TipoActividad[] =
    dia === 'BUENO' ? ['EXTERIOR', 'MIXTA', 'INTERIOR'] : ['INTERIOR', 'MIXTA', 'EXTERIOR'];
  return preferidas.indexOf(tipo);
}