import { Module } from '@nestjs/common';
import { OpenMeteoProvider } from './open-meteo.provider';
import { WEATHER_PROVIDER } from './weather-provider.interface';

// Quien pida @Inject(WEATHER_PROVIDER) recibe el adaptador de Open-Meteo.
@Module({
  providers: [{ provide: WEATHER_PROVIDER, useClass: OpenMeteoProvider }],
  exports: [WEATHER_PROVIDER],
})
export class ClimaModule {}