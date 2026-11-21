import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';
import { DestinosController } from './destinos.controller';

@Module({
  imports: [AuthModule], // trae los guards y el JwtService
  controllers: [CatalogoController, DestinosController],
  providers: [CatalogoService],
})
export class CatalogoModule {}