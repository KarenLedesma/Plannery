import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, UsuarioActual } from '../../common/decorators/current-user.decorator';
import { CatalogoService } from './catalogo.service';
import {
  ActualizarActividadDto,
  CrearActividadDto,
  ListarActividadesQueryDto,
} from './catalogo.dto';

// JwtAuthGuard primero: deja { id, rol } en la petición. RolesGuard lo usa después.
@Controller('actividades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CatalogoController {
  constructor(private readonly catalogo: CatalogoService) {}

  // Cualquier usuario logueado. Sin @Roles, RolesGuard deja pasar.
  @Get()
  listar(@Query() query: ListarActividadesQueryDto, @CurrentUser() usuario: UsuarioActual) {
    return this.catalogo.listar(query, usuario);
  }

  @Roles('ADMIN')
  @Post()
  crear(@Body() dto: CrearActividadDto) {
    return this.catalogo.crear(dto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ActualizarActividadDto) {
    return this.catalogo.actualizar(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalogo.eliminar(id);
  }
}