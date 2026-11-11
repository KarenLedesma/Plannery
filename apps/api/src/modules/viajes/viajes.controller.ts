import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { ViajesService } from './viajes.service';
import { ActualizarViajeDto, CrearViajeDto } from './viajes.dto';

@Controller('viajes')
@UseGuards(JwtAuthGuard)
export class ViajesController {
  constructor(private viajes: ViajesService) {}

  @Get()
  listar(@CurrentUser() usuario: UsuarioActual) {
    return this.viajes.listar(usuario.id);
  }

  @Post()
  crear(@Body() dto: CrearViajeDto, @CurrentUser() usuario: UsuarioActual) {
    return this.viajes.crear(dto, usuario.id);
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: UsuarioActual) {
    return this.viajes.obtener(id, usuario.id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarViajeDto,
    @CurrentUser() usuario: UsuarioActual,
  ) {
    return this.viajes.actualizar(id, dto, usuario.id);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: UsuarioActual) {
    return this.viajes.eliminar(id, usuario.id);
  }
}
