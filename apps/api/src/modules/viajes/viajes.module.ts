import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';

@Module({
  imports: [AuthModule],
  controllers: [ViajesController],
  providers: [ViajesService],
})
export class ViajesModule {}
