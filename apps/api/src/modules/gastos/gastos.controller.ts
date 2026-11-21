import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { GastosService } from './gastos.service';
import { ActualizarGastoDto, CrearGastoDto, FiltroGastosDto } from './gastos.dto';

// Los gastos siempre cuelgan de un viaje: /viajes/:viajeId/gastos
@Controller('viajes/:viajeId/gastos')
@UseGuards(JwtAuthGuard)
export class GastosController {
  constructor(private gastos: GastosService) {}

  @Get()
  listar(
    @Param('viajeId', ParseUUIDPipe) viajeId: string,
    @CurrentUser() usuario: UsuarioActual,
    @Query() filtros: FiltroGastosDto,
  ) {
    return this.gastos.listar(viajeId, usuario.id, filtros);
  }

  @Post()
  crear(
    @Param('viajeId', ParseUUIDPipe) viajeId: string,
    @CurrentUser() usuario: UsuarioActual,
    @Body() dto: CrearGastoDto,
  ) {
    return this.gastos.crear(viajeId, usuario.id, dto);
  }

  @Patch(':gastoId')
  actualizar(
    @Param('viajeId', ParseUUIDPipe) viajeId: string,
    @Param('gastoId', ParseUUIDPipe) gastoId: string,
    @CurrentUser() usuario: UsuarioActual,
    @Body() dto: ActualizarGastoDto,
  ) {
    return this.gastos.actualizar(viajeId, gastoId, usuario.id, dto);
  }

  @Delete(':gastoId')
  borrar(
    @Param('viajeId', ParseUUIDPipe) viajeId: string,
    @Param('gastoId', ParseUUIDPipe) gastoId: string,
    @CurrentUser() usuario: UsuarioActual,
  ) {
    return this.gastos.borrar(viajeId, gastoId, usuario.id);
  }
}
