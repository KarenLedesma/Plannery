import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';

@Module({
  imports: [AuthModule], // trae los guards y el JwtService
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}