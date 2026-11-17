import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PronosticoDia, WeatherProvider } from './weather-provider.interface';

const URL_BASE = 'https://api.open-meteo.com/v1/forecast';
// Open-Meteo ofrece hasta 16 días contando hoy. Si cambia ese límite, se ajusta acá.
const DIAS_MAXIMOS = 16;
const TIEMPO_MAXIMO_MS = 5000;
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

interface RespuestaOpenMeteo {
  daily?: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_probability_max: (number | null)[];
  };
}

@Injectable()
export class OpenMeteoProvider implements WeatherProvider {
  private readonly logger = new Logger(OpenMeteoProvider.name);

  async pronostico(
    latitud: number,
    longitud: number,
    desde: string,
    hasta: string,
    zonaHoraria: string,
  ): Promise<PronosticoDia[]> {
    if (!FORMATO_FECHA.test(desde) || !FORMATO_FECHA.test(hasta)) {
      throw new BadRequestException('Las fechas deben tener el formato AAAA-MM-DD');
    }

    // Recortamos el rango a lo que el servicio puede dar: de hoy a hoy + 15 días
    const hoy = this.hoyEn(zonaHoraria);
    const ultimoDia = this.sumarDias(hoy, DIAS_MAXIMOS - 1);
    const inicio = desde < hoy ? hoy : desde;
    const fin = hasta > ultimoDia ? ultimoDia : hasta;
    if (inicio > fin) return []; // todo el viaje queda fuera del alcance del pronóstico

    const parametros = new URLSearchParams({
      latitude: String(latitud),
      longitude: String(longitud),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: zonaHoraria,
      start_date: inicio,
      end_date: fin,
    });

    let respuesta: Response;
    try {
      respuesta = await fetch(`${URL_BASE}?${parametros}`, {
        signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
      });
    } catch (error) {
      this.logger.error(`Open-Meteo no respondió: ${String(error)}`);
      throw new ServiceUnavailableException('No se pudo obtener el pronóstico');
    }

    if (!respuesta.ok) {
      this.logger.error(`Open-Meteo respondió con estado ${respuesta.status}`);
      throw new ServiceUnavailableException('No se pudo obtener el pronóstico');
    }

    const datos = (await respuesta.json()) as RespuestaOpenMeteo;
    const diario = datos.daily;
    if (!diario) {
      this.logger.error('La respuesta de Open-Meteo no trae el bloque "daily"');
      throw new ServiceUnavailableException('No se pudo obtener el pronóstico');
    }

    // Open-Meteo devuelve listas paralelas: la posición i de cada lista es el mismo día
    const dias: PronosticoDia[] = [];
    diario.time.forEach((fecha, i) => {
      const tempMax = diario.temperature_2m_max[i];
      const tempMin = diario.temperature_2m_min[i];
      const probLluvia = diario.precipitation_probability_max[i];
      // Si falta algún dato no se puede clasificar el día: lo descartamos
      if (tempMax == null || tempMin == null || probLluvia == null) return;
      dias.push({ fecha, tempMax, tempMin, probLluvia });
    });
    return dias;
  }

  // Fecha de hoy en la zona horaria del destino, como AAAA-MM-DD
  private hoyEn(zonaHoraria: string): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: zonaHoraria }).format(new Date());
  }

  private sumarDias(fecha: string, dias: number): string {
    const d = new Date(`${fecha}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + dias);
    return d.toISOString().slice(0, 10);
  }
}