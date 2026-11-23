import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { ResumenService } from './resumen.service';
import { GuardarIaConfigDto } from './resumen.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ResumenController {
  constructor(private resumenService: ResumenService) {}

  @Get('ia/config')
  obtenerConfig(@CurrentUser() usuario: UsuarioActual) {
    return this.resumenService.obtenerConfig(usuario.id);
  }

  @Put('ia/config')
  guardarConfig(@Body() dto: GuardarIaConfigDto, @CurrentUser() usuario: UsuarioActual) {
    return this.resumenService.guardarConfig(usuario.id, dto);
  }

  @Delete('ia/config')
  eliminarConfig(@CurrentUser() usuario: UsuarioActual) {
    return this.resumenService.eliminarConfig(usuario.id);
  }

  @Post('viajes/:id/resumen')
  generarResumen(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() usuario: UsuarioActual,
  ) {
    return this.resumenService.generarResumenViaje(id, usuario.id);
  }
}