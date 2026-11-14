import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Actividad } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UsuarioActual } from '../../common/decorators/current-user.decorator';
import {
  ActualizarActividadDto,
  CrearActividadDto,
  ListarActividadesQueryDto,
} from './catalogo.dto';

@Injectable()
export class CatalogoService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(query: ListarActividadesQueryDto, usuario: UsuarioActual) {
    const esAdmin = usuario.rol === 'ADMIN';
    const actividades = await this.prisma.actividad.findMany({
      where: {
        destinoId: query.destinoId,
        tipo: query.tipo,
        // Los viajeros solo ven las activas. El admin ve todas, o filtra con ?activa=
        activa: esAdmin ? query.activa : true,
      },
      orderBy: { nombre: 'asc' },
    });
    return actividades.map((a) => this.aRespuesta(a));
  }

  async crear(dto: CrearActividadDto) {
    await this.asegurarDestino(dto.destinoId);
    const actividad = await this.prisma.actividad.create({ data: dto });
    return this.aRespuesta(actividad);
  }

  async actualizar(id: string, dto: ActualizarActividadDto) {
    await this.buscarOFallar(id);
    if (dto.destinoId) await this.asegurarDestino(dto.destinoId);
    const actividad = await this.prisma.actividad.update({ where: { id }, data: dto });
    return this.aRespuesta(actividad);
  }

  // Si la actividad ya está en algún itinerario se archiva, para no romper esos viajes.
  async eliminar(id: string) {
    await this.buscarOFallar(id);
    const enUso = await this.prisma.itinerarioItem.count({ where: { actividadId: id } });
    if (enUso > 0) {
      await this.prisma.actividad.update({ where: { id }, data: { activa: false } });
      return { id, accion: 'archivada' };
    }
    await this.prisma.actividad.delete({ where: { id } });
    return { id, accion: 'eliminada' };
  }

  private async buscarOFallar(id: string) {
    const actividad = await this.prisma.actividad.findUnique({ where: { id } });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');
    return actividad;
  }

  private async asegurarDestino(destinoId: string) {
    const destino = await this.prisma.destino.findUnique({ where: { id: destinoId } });
    if (!destino) throw new BadRequestException('El destino indicado no existe');
  }

  // Prisma devuelve las coordenadas como objetos Decimal: las pasamos a número para el JSON
  private aRespuesta(a: Actividad) {
    return {
      ...a,
      latitud: a.latitud ? a.latitud.toNumber() : null,
      longitud: a.longitud ? a.longitud.toNumber() : null,
    };
  }
}