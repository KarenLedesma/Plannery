import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActualizarItinerarioDto, CrearItinerarioDto } from './itinerario.dto';

const aTexto = (fecha: Date) => fecha.toISOString().slice(0, 10);
// La columna es de tipo fecha (sin hora): se guarda a medianoche UTC
const aFecha = (texto: string) => new Date(`${texto.slice(0, 10)}T00:00:00.000Z`);

@Injectable()
export class ItinerarioService {
  constructor(private prisma: PrismaService) {}

  // Regla de oro: el viaje se busca por id Y por dueño. Si es ajeno, responde 404.
  private async viajeDelUsuario(viajeId: string, usuarioId: string) {
    const viaje = await this.prisma.viaje.findFirst({ where: { id: viajeId, usuarioId } });
    if (!viaje) throw new NotFoundException('Viaje no encontrado');
    return viaje;
  }

  // La fecha del ítem tiene que caer dentro de las fechas del viaje
  private validarFecha(texto: string, viaje: { fechaInicio: Date; fechaFin: Date }) {
    const fecha = aFecha(texto);
    if (Number.isNaN(fecha.getTime())) throw new BadRequestException('La fecha no es válida');
    const dia = aTexto(fecha);
    if (dia < aTexto(viaje.fechaInicio) || dia > aTexto(viaje.fechaFin)) {
      throw new BadRequestException('La fecha tiene que estar dentro de las fechas del viaje');
    }
    return fecha;
  }

  private async validarActividad(actividadId: string) {
    const actividad = await this.prisma.actividad.findFirst({ where: { id: actividadId, activa: true } });
    if (!actividad) throw new BadRequestException('La actividad no existe o está archivada');
  }

  // Un viaje no puede repetir la misma actividad el mismo día (restricción única de la tabla)
  private async conConflicto<T>(accion: () => Promise<T>): Promise<T> {
    try {
      return await accion();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Esa actividad ya está en el itinerario ese día');
      }
      throw e;
    }
  }

  async listar(viajeId: string, usuarioId: string) {
    await this.viajeDelUsuario(viajeId, usuarioId);
    return this.prisma.itinerarioItem.findMany({
      where: { viajeId },
      orderBy: [{ fecha: 'asc' }, { orden: 'asc' }],
      include: { actividad: { select: { id: true, nombre: true, tipo: true } } },
    });
  }

  async crear(viajeId: string, dto: CrearItinerarioDto, usuarioId: string) {
    const viaje = await this.viajeDelUsuario(viajeId, usuarioId);
    const fecha = this.validarFecha(dto.fecha, viaje);
    await this.validarActividad(dto.actividadId);
    return this.conConflicto(() =>
      this.prisma.itinerarioItem.create({
        data: { viajeId: viaje.id, actividadId: dto.actividadId, fecha, orden: dto.orden, nota: dto.nota },
      }),
    );
  }

  async actualizar(dto: ActualizarItinerarioDto, itemId: string, usuarioId: string, viajeId: string) {
    const viaje = await this.viajeDelUsuario(viajeId, usuarioId);
    const item = await this.prisma.itinerarioItem.findFirst({ where: { id: itemId, viajeId: viaje.id } });
    if (!item) throw new NotFoundException('Ítem no encontrado');

    // Solo se cambia lo que vino en el pedido
    const data: Prisma.ItinerarioItemUncheckedUpdateInput = {};
    if (dto.fecha !== undefined) data.fecha = this.validarFecha(dto.fecha, viaje);
    if (dto.actividadId !== undefined) {
      await this.validarActividad(dto.actividadId);
      data.actividadId = dto.actividadId;
    }
    if (dto.orden !== undefined) data.orden = dto.orden;
    if (dto.nota !== undefined) data.nota = dto.nota;

    return this.conConflicto(() => this.prisma.itinerarioItem.update({ where: { id: item.id }, data }));
  }

  async eliminar(viajeId: string, itemId: string, usuarioId: string) {
    const viaje = await this.viajeDelUsuario(viajeId, usuarioId);
    const item = await this.prisma.itinerarioItem.findFirst({ where: { id: itemId, viajeId: viaje.id } });
    if (!item) throw new NotFoundException('Ítem no encontrado');
    return this.prisma.itinerarioItem.delete({ where: { id: item.id } });
  }
}