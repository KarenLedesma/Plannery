import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ItinerarioService {
  constructor(private prisma: PrismaService) {}

  async listar(itinerarioId: string, usuarioId: string) {
    return this.prisma.itinerarioItem.findMany({
      where: { viajeId: itinerarioId },
    });
  }

  async crear(itinerarioId: string, dto: any, usuarioId: string) {
    return this.prisma.itinerarioItem.create({
      data: dto,
    });
  }

  async actualizar(dto: any, itemId: string, usuarioId: string, usuarioCreoId: string) {
    return this.prisma.itinerarioItem.update({
      where: { id: itemId },
      data: dto,
    });
  }

  async eliminar(itinerarioId: string, itemId: string, usuarioId: string) {
    return this.prisma.itinerarioItem.delete({
      where: { id: itemId },
    });
  }
}