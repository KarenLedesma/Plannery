import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActualizarGastoDto, CrearGastoDto, FiltroGastosDto } from './gastos.dto';

@Injectable()
export class GastosService {
  constructor(private prisma: PrismaService) {}

  // Toda operación empieza acá: el viaje tiene que ser del usuario.
  // Si es de otra persona responde 404, igual que si no existiera.
  private async viajeDelUsuario(viajeId: string, usuarioId: string) {
    const viaje = await this.prisma.viaje.findFirst({ where: { id: viajeId, usuarioId } });
    if (!viaje) throw new NotFoundException('Viaje no encontrado');
    return viaje;
  }

  // El gasto se busca siempre dentro del viaje ya verificado
  private async gastoDelViaje(gastoId: string, viajeId: string) {
    const gasto = await this.prisma.gasto.findFirst({ where: { id: gastoId, viajeId } });
    if (!gasto) throw new NotFoundException('Gasto no encontrado');
    return gasto;
  }

  // Prisma devuelve el dinero como Decimal (texto en JSON). Se entrega como número para el frontend.
  private plano(g: any) {
    return {
      ...g,
      montoEstimado: Number(g.montoEstimado),
      montoReal: g.montoReal === null ? null : Number(g.montoReal),
    };
  }

  async listar(viajeId: string, usuarioId: string, filtros: FiltroGastosDto) {
    await this.viajeDelUsuario(viajeId, usuarioId);
    const gastos = await this.prisma.gasto.findMany({
      where: {
        viajeId,
        ...(filtros.fase && { fase: filtros.fase }),
        ...(filtros.categoria && { categoria: filtros.categoria }),
      },
      orderBy: { creadoEn: 'desc' },
    });
    return gastos.map((g) => this.plano(g));
  }

  async crear(viajeId: string, usuarioId: string, dto: CrearGastoDto) {
    await this.viajeDelUsuario(viajeId, usuarioId);
    const gasto = await this.prisma.gasto.create({
      data: {
        viajeId,
        descripcion: dto.descripcion,
        categoria: dto.categoria,
        fase: dto.fase,
        montoEstimado: dto.montoEstimado,
        montoReal: dto.montoReal ?? null,
        fecha: dto.fecha ? new Date(dto.fecha) : null,
        nota: dto.nota ?? null,
      },
    });
    return this.plano(gasto);
  }

  async actualizar(viajeId: string, gastoId: string, usuarioId: string, dto: ActualizarGastoDto) {
    await this.viajeDelUsuario(viajeId, usuarioId);
    await this.gastoDelViaje(gastoId, viajeId);

    const gasto = await this.prisma.gasto.update({
      where: { id: gastoId },
      data: {
        ...dto,
        fecha: dto.fecha !== undefined 
          ? (dto.fecha ? new Date(dto.fecha) : null) 
          : undefined,
      },
    });
    return this.plano(gasto);
  }

  async borrar(viajeId: string, gastoId: string, usuarioId: string) {
    await this.viajeDelUsuario(viajeId, usuarioId);
    await this.gastoDelViaje(gastoId, viajeId);
    await this.prisma.gasto.delete({ where: { id: gastoId } });
    return { ok: true };
  }
}