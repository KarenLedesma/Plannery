import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResumenController } from './resumen.controller';
import { ResumenService } from './resumen.service';

@Module({
  imports: [AuthModule],
  controllers: [ResumenController],
  providers: [ResumenService],
})
export class ResumenModule {}