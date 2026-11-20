import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WeatherProvider } from '../../integrations/clima/weather-provider.interface';
import { RecomendacionesService } from './recomendaciones.service';

// Datos de prueba: un viaje de dos días a Buenos Aires
const viaje = {
  id: 'v1',
  usuarioId: 'u1',
  destinoId: 'd1',
  fechaInicio: new Date('2026-11-20T00:00:00Z'),
  fechaFin: new Date('2026-11-21T00:00:00Z'),
  destino: {
    nombre: 'Buenos Aires',
    latitud: -34.6,
    longitud: -58.4,
    zonaHoraria: 'America/Argentina/Buenos_Aires',
  },
};

const actividad = (id: string, nombre: string, tipo: string) => ({
  id,
  nombre,
  tipo,
  descripcion: null,
  direccion: null,
});

const diaLluvioso = { fecha: '2026-11-20', tempMax: 20, tempMin: 14, probLluvia: 80 };
const diaBueno = { fecha: '2026-11-21', tempMax: 24, tempMin: 16, probLluvia: 10 };

describe('RecomendacionesService', () => {
  let prisma: any;
  let clima: any;
  let service: RecomendacionesService;

  beforeEach(() => {
    prisma = {
      viaje: { findFirst: jest.fn() },
      actividad: { findMany: jest.fn() },
    };
    clima = { pronostico: jest.fn() };
    service = new RecomendacionesService(
      prisma as unknown as PrismaService,
      clima as unknown as WeatherProvider,
    );
  });

  it('responde 404 si el viaje no es del usuario y no consulta el clima', async () => {
    prisma.viaje.findFirst.mockResolvedValue(null);

    await expect(service.recomendar('v1', 'otro-usuario')).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.viaje.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', usuarioId: 'otro-usuario' },
      include: { destino: true },
    });
    expect(clima.pronostico).not.toHaveBeenCalled();
  });

  it('pide el clima con las coordenadas, fechas y zona horaria del viaje', async () => {
    prisma.viaje.findFirst.mockResolvedValue(viaje);
    prisma.actividad.findMany.mockResolvedValue([]);
    clima.pronostico.mockResolvedValue([diaLluvioso, diaBueno]);

    await service.recomendar('v1', 'u1');

    expect(clima.pronostico).toHaveBeenCalledWith(
      -34.6,
      -58.4,
      '2026-11-20',
      '2026-11-21',
      'America/Argentina/Buenos_Aires',
    );
    expect(prisma.actividad.findMany).toHaveBeenCalledWith({
      where: { destinoId: 'd1', activa: true },
      orderBy: { nombre: 'asc' },
    });
  });

  it('en un día lluvioso deja afuera las de exterior y pone primero las de interior', async () => {
    prisma.viaje.findFirst.mockResolvedValue(viaje);
    prisma.actividad.findMany.mockResolvedValue([
      actividad('a1', 'Parque', 'EXTERIOR'),
      actividad('a2', 'Museo', 'INTERIOR'),
      actividad('a3', 'Mercado', 'MIXTA'),
    ]);
    clima.pronostico.mockResolvedValue([diaLluvioso, diaBueno]);

    const resultado = await service.recomendar('v1', 'u1');

    const lluvioso = resultado.dias[0];
    expect(lluvioso.clima.tipoDia).toBe('LLUVIOSO');
    expect(lluvioso.actividades.map((a) => a.nombre)).toEqual(['Museo', 'Mercado']);

    const bueno = resultado.dias[1];
    expect(bueno.clima.tipoDia).toBe('BUENO');
    expect(bueno.actividades.map((a) => a.nombre)).toEqual(['Parque', 'Mercado', 'Museo']);
  });

  it('informa las fechas del viaje que no tienen pronóstico', async () => {
    prisma.viaje.findFirst.mockResolvedValue(viaje);
    prisma.actividad.findMany.mockResolvedValue([]);
    clima.pronostico.mockResolvedValue([diaLluvioso]);

    const resultado = await service.recomendar('v1', 'u1');

    expect(resultado.destino).toBe('Buenos Aires');
    expect(resultado.sinPronostico).toEqual(['2026-11-21']);
  });
});