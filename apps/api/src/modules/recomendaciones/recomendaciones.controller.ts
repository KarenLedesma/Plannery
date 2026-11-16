import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { RecomendacionesService } from './recomendaciones.service';

@Controller('viajes')
@UseGuards(JwtAuthGuard)
export class RecomendacionesController {
  constructor(private readonly recomendaciones: RecomendacionesService) {}

  @Get(':id/recomendaciones')
  recomendar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: UsuarioActual) {
    return this.recomendaciones.recomendar(id, usuario.id);
  }
}