import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClimaModule } from '../../integrations/clima/clima.module';
import { RecomendacionesController } from './recomendaciones.controller';
import { RecomendacionesService } from './recomendaciones.service';

@Module({
  imports: [AuthModule, ClimaModule],
  controllers: [RecomendacionesController],
  providers: [RecomendacionesService],
})
export class RecomendacionesModule {}