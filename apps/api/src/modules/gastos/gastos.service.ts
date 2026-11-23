import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActualizarGastoDto, CATEGORIAS, CrearGastoDto, FASES, FiltroGastosDto } from './gastos.dto';

const num = (d: unknown) => (d == null ? 0 : Number(d));
// Evita restos de coma flotante al restar importes (por ejemplo 0.1 + 0.2)
const redondear = (n: number) => Math.round(n * 100) / 100;
const fila = (estimado: number, real: number) => ({ estimado, real, diferencia: redondear(real - estimado) });

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

  // Compara lo estimado con lo real por categoría y por fase, y contra el presupuesto.
  // Las sumas las hace la base de datos con Decimal exacto; acá solo se convierten a número.
  // diferencia = real - estimado: positiva si se gastó más de lo estimado.
  async comparar(viajeId: string, usuarioId: string) {
    const viaje = await this.viajeDelUsuario(viajeId, usuarioId);
    const suma = { montoEstimado: true, montoReal: true } as const;

    const [total, porCategoria, porFase] = await Promise.all([
      this.prisma.gasto.aggregate({ where: { viajeId }, _sum: suma }),
      this.prisma.gasto.groupBy({ by: ['categoria'], where: { viajeId }, _sum: suma }),
      this.prisma.gasto.groupBy({ by: ['fase'], where: { viajeId }, _sum: suma }),
    ]);

    const estimado = num(total._sum.montoEstimado);
    const real = num(total._sum.montoReal);
    const presupuesto = num(viaje.presupuesto);

    return {
      moneda: viaje.moneda,
      presupuesto,
      total: fila(estimado, real),
      disponible: redondear(presupuesto - real),
      // Se devuelven todas las categorías y fases, aunque no tengan gastos, para que el frontend las dibuje siempre
      porCategoria: CATEGORIAS.map((categoria) => {
        const g = porCategoria.find((x) => x.categoria === categoria);
        return { categoria, ...fila(num(g?._sum.montoEstimado), num(g?._sum.montoReal)) };
      }),
      porFase: FASES.map((fase) => {
        const g = porFase.find((x) => x.fase === fase);
        return { fase, ...fila(num(g?._sum.montoEstimado), num(g?._sum.montoReal)) };
      }),
    };
  }
}
