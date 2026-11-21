import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';

// Importa AuthModule para poder usar JwtAuthGuard
@Module({ imports: [AuthModule], controllers: [GastosController], providers: [GastosService] })
export class GastosModule {}
