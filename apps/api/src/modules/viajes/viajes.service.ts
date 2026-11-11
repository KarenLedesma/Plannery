import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActualizarViajeDto, CrearViajeDto } from './viajes.dto';

const DESTINO_PUBLICO = { id: true, nombre: true, slug: true } as const;

function validarRangoFechas(fechaInicio: string, fechaFin: string) {
  // Compara strings en formato YYYY-MM-DD (ordena correctamente por naturaleza)
  if (fechaFin < fechaInicio) {
    throw new BadRequestException('La fecha de fin no puede ser anterior a la de inicio');
  }
}

function fechaCorta(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

@Injectable()
export class ViajesService {
  constructor(private prisma: PrismaService) {}

  listar(usuarioId: string) {
    return this.prisma.viaje.findMany({
      where: { usuarioId },
      orderBy: { fechaInicio: 'asc' },
      include: { destino: { select: DESTINO_PUBLICO } },
    });
  }

  async obtener(id: string, usuarioId: string) {
    const viaje = await this.prisma.viaje.findFirst({
      where: { id, usuarioId },
      include: { destino: { select: DESTINO_PUBLICO } },
    });
    if (!viaje) throw new NotFoundException('Viaje no encontrado');
    return viaje;
  }

  async crear(dto: CrearViajeDto, usuarioId: string) {
    validarRangoFechas(dto.fechaInicio, dto.fechaFin);
    await this.validarDestino(dto.destinoId);

    // Construye el objeto de datos para Prisma
    const createData: any = {
      nombre: dto.nombre,
      destinoId: dto.destinoId,
      fechaInicio: new Date(dto.fechaInicio + 'T00:00:00'),
      fechaFin: new Date(dto.fechaFin + 'T00:00:00'),
      presupuesto: dto.presupuesto,
      moneda: dto.moneda,
      usuarioId,
    };

    // Si vienen creadoEn/actualizadoEn, se añaden (en milisegundos o según formato)
    // El payload trae timestamps en segundos (ej. 1778553600), Prisma espera Date/Posix
    if (dto.creadoEn !== undefined) {
      // Convertir segundos a Date: multiplicar por 1000 para obtener milisegundos
      createData.creadoEn = new Date(Number(dto.creadoEn) * 1000);
    }
    if (dto.actualizadoEn !== undefined) {
      createData.actualizadoEn = new Date(Number(dto.actualizadoEn) * 1000);
    }

    return this.prisma.viaje.create({
      data: createData,
      include: { destino: { select: DESTINO_PUBLICO } },
    });
  }

  async actualizar(id: string, dto: ActualizarViajeDto, usuarioId: string) {
    const actual = await this.obtener(id, usuarioId);
    // Validación con strings (formato YYYY-MM-DD) - funciona por comparación lexicográfica
    if (dto.fechaFin && dto.fechaInicio && dto.fechaFin < dto.fechaInicio) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la de inicio');
    }
    if (dto.destinoId) await this.validarDestino(dto.destinoId);
    // Construye el objeto de actualización solo con los campos que vienen definidos
    const updateData: any = {};
    if (dto.nombre) updateData.nombre = dto.nombre;
    if (dto.destinoId) updateData.destinoId = dto.destinoId;
    if (dto.fechaInicio) {
      updateData.fechaInicio = new Date(dto.fechaInicio + 'T00:00:00');
    }
    if (dto.fechaFin) updateData.fechaFin = new Date(dto.fechaFin + 'T00:00:00');
    if (dto.presupuesto !== undefined) updateData.presupuesto = dto.presupuesto;
    if (dto.moneda) updateData.moneda = dto.moneda;
    return this.prisma.viaje.update({
      where: { id },
      data: updateData,
      include: { destino: { select: DESTINO_PUBLICO } },
    });
  }

  async eliminar(id: string, usuarioId: string) {
    await this.obtener(id, usuarioId);
    return this.prisma.viaje.delete({ where: { id } });
  }

  private async validarDestino(destinoId: string) {
    const destino = await this.prisma.destino.findUnique({ where: { id: destinoId } });
    if (!destino) throw new NotFoundException('El destino no existe');
  }
}
