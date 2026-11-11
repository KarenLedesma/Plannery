import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { ItinerarioService } from './itinerario.service';
import { CrearItinerarioDto, ActualizarItinerarioDto } from './itinerario.dto';

@Controller('viajes')
@UseGuards(JwtAuthGuard)
export class ItinerarioController {
  constructor(private itinerario: ItinerarioService) {}

  @Get(':itinerarioId')
  async listar(
    @Param('itinerarioId') itinerarioId: string,
    @CurrentUser() usuario: UsuarioActual
  ) {
    return this.itinerario.listar(itinerarioId, usuario.id);
  }

  @Post(':itinerarioId')
  async crear(
    @Param('itinerarioId') itinerarioId: string,
    @Body() dto: CrearItinerarioDto,
    @CurrentUser() usuario: UsuarioActual
  ) {
    return this.itinerario.crear(itinerarioId, dto, usuario.id);
  }

  @Patch(':itinerarioId/:itemId')
  async actualizar(
    @Param('itinerarioId') itinerarioId: string,
    @Param('itemId') itemId: string,
    @Body() dto: ActualizarItinerarioDto,
    @CurrentUser() usuario: UsuarioActual
  ) {
    return this.itinerario.actualizar(dto, itemId, usuario.id, itinerarioId);
  }

  @Delete(':itinerarioId/:itemId')
  async eliminar(
    @Param('itinerarioId') itinerarioId: string,
    @Param('itemId') itemId: string,
    @CurrentUser() usuario: UsuarioActual
  ) {
    return this.itinerario.eliminar(itinerarioId, itemId, usuario.id);
  }
}