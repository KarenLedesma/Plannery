import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ItinerarioController } from './itinerario.controller';
import { ItinerarioService } from './itinerario.service';

@Module({
  imports: [AuthModule],
  controllers: [ItinerarioController],
  providers: [ItinerarioService],
})
export class ItinerarioModule {}