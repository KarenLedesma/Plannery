import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Actividad } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WEATHER_PROVIDER, WeatherProvider } from '../../integrations/clima/weather-provider.interface';
import { clasificarDia, conviene, prioridad } from './recomendaciones.rules';

function fechaCorta(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

// Lista de fechas AAAA-MM-DD entre dos fechas, ambas incluidas
function fechasEntre(desde: string, hasta: string): string[] {
  const fechas: string[] = [];
  const dia = new Date(`${desde}T00:00:00Z`);
  const fin = new Date(`${hasta}T00:00:00Z`);
  while (dia <= fin) {
    fechas.push(dia.toISOString().slice(0, 10));
    dia.setUTCDate(dia.getUTCDate() + 1);
  }
  return fechas;
}

@Injectable()
export class RecomendacionesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WEATHER_PROVIDER) private readonly clima: WeatherProvider,
  ) {}

  async recomendar(viajeId: string, usuarioId: string) {
    // Regla de oro: el viaje se busca por id Y por dueño. Si es ajeno, responde 404.
    const viaje = await this.prisma.viaje.findFirst({
      where: { id: viajeId, usuarioId },
      include: { destino: true },
    });
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    const desde = fechaCorta(viaje.fechaInicio);
    const hasta = fechaCorta(viaje.fechaFin);

    const pronostico = await this.clima.pronostico(
      Number(viaje.destino.latitud),
      Number(viaje.destino.longitud),
      desde,
      hasta,
      viaje.destino.zonaHoraria,
    );

    // Solo actividades activas del destino del viaje
    const actividades = await this.prisma.actividad.findMany({
      where: { destinoId: viaje.destinoId, activa: true },
      orderBy: { nombre: 'asc' },
    });

    const dias = pronostico.map((dia) => {
      const tipoDia = clasificarDia(dia);
      const recomendadas = actividades
        .filter((a) => conviene(a.tipo, tipoDia))
        .sort((a, b) => prioridad(a.tipo, tipoDia) - prioridad(b.tipo, tipoDia));
      return {
        fecha: dia.fecha,
        clima: { tempMax: dia.tempMax, tempMin: dia.tempMin, probLluvia: dia.probLluvia, tipoDia },
        actividades: recomendadas.map((a) => this.aRespuesta(a)),
      };
    });

    // Fechas del viaje para las que no hay pronóstico (superan el alcance del servicio)
    const conPronostico = new Set(pronostico.map((d) => d.fecha));
    const sinPronostico = fechasEntre(desde, hasta).filter((f) => !conPronostico.has(f));

    return { viajeId: viaje.id, destino: viaje.destino.nombre, dias, sinPronostico };
  }

  private aRespuesta(a: Actividad) {
    return { id: a.id, nombre: a.nombre, descripcion: a.descripcion, tipo: a.tipo, direccion: a.direccion };
  }
}