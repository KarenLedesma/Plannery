import { TipoActividad } from '@prisma/client';
import { PronosticoDia } from '../../integrations/clima/weather-provider.interface';
import {
  CALOR_EXTREMO,
  FRIO_EXTREMO,
  TipoDia,
  UMBRAL_LLUVIA,
  clasificarDia,
  conviene,
  prioridad,
} from './recomendaciones.rules';

// Un día templado y seco por defecto; cada test cambia solo lo que le interesa
const dia = (cambios: Partial<PronosticoDia> = {}): PronosticoDia => ({
  fecha: '2026-11-20',
  tempMax: 24,
  tempMin: 16,
  probLluvia: 10,
  ...cambios,
});

describe('clasificarDia', () => {
  it('clasifica como BUENO un día templado y seco', () => {
    expect(clasificarDia(dia())).toBe('BUENO');
  });

  it('pasa a LLUVIOSO justo en el umbral de probabilidad de lluvia', () => {
    expect(clasificarDia(dia({ probLluvia: UMBRAL_LLUVIA - 1 }))).toBe('BUENO');
    expect(clasificarDia(dia({ probLluvia: UMBRAL_LLUVIA }))).toBe('LLUVIOSO');
  });

  it('pasa a EXTREMO justo en el umbral de calor', () => {
    expect(clasificarDia(dia({ tempMax: CALOR_EXTREMO - 1 }))).toBe('BUENO');
    expect(clasificarDia(dia({ tempMax: CALOR_EXTREMO }))).toBe('EXTREMO');
  });

  it('pasa a EXTREMO cuando la máxima queda por debajo del umbral de frío', () => {
    expect(clasificarDia(dia({ tempMax: FRIO_EXTREMO }))).toBe('BUENO');
    expect(clasificarDia(dia({ tempMax: FRIO_EXTREMO - 1 }))).toBe('EXTREMO');
  });

  it('evalúa el clima extremo antes que la lluvia', () => {
    expect(clasificarDia(dia({ tempMax: 35, probLluvia: 90 }))).toBe('EXTREMO');
  });
});

describe('conviene', () => {
  it.each([
    ['INTERIOR', 'BUENO', true],
    ['INTERIOR', 'LLUVIOSO', true],
    ['INTERIOR', 'EXTREMO', true],
    ['MIXTA', 'BUENO', true],
    ['MIXTA', 'LLUVIOSO', true],
    ['MIXTA', 'EXTREMO', false],
    ['EXTERIOR', 'BUENO', true],
    ['EXTERIOR', 'LLUVIOSO', false],
    ['EXTERIOR', 'EXTREMO', false],
  ] as [TipoActividad, TipoDia, boolean][])('%s en día %s → %s', (tipo, tipoDia, esperado) => {
    expect(conviene(tipo, tipoDia)).toBe(esperado);
  });
});

describe('prioridad', () => {
  const tipos: TipoActividad[] = ['INTERIOR', 'EXTERIOR', 'MIXTA'];
  const ordenar = (tipoDia: TipoDia) => [...tipos].sort((a, b) => prioridad(a, tipoDia) - prioridad(b, tipoDia));

  it('en un día BUENO ordena exterior, mixta e interior', () => {
    expect(ordenar('BUENO')).toEqual(['EXTERIOR', 'MIXTA', 'INTERIOR']);
  });

  it.each(['LLUVIOSO', 'EXTREMO'] as TipoDia[])('en un día %s ordena interior, mixta y exterior', (tipoDia) => {
    expect(ordenar(tipoDia)).toEqual(['INTERIOR', 'MIXTA', 'EXTERIOR']);
  });
});