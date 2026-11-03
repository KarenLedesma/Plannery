// Contrato para obtener el pronóstico. Hoy lo cumple Open-Meteo (F3).
// Si mañana se cambia de servicio, se escribe otro adaptador y el resto del código no se entera.
export interface PronosticoDia {
  fecha: string; // AAAA-MM-DD
  tempMax: number;
  tempMin: number;
  probLluvia: number; // 0 a 100
}

export interface WeatherProvider {
  pronostico(latitud: number, longitud: number, desde: string, hasta: string, zonaHoraria: string): Promise<PronosticoDia[]>;
}

// Token para inyectar el proveedor: @Inject(WEATHER_PROVIDER)
export const WEATHER_PROVIDER = Symbol('WEATHER_PROVIDER');
