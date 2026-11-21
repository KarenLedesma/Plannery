import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

// Lista los destinos disponibles. Lo usan los selectores de las pantallas (catálogo, viajes).
// Solo hace falta tener sesión: son datos de consulta, no tienen dueño.
@Controller('destinos')
@UseGuards(JwtAuthGuard)
export class DestinosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  listar() {
    return this.prisma.destino.findMany({
      select: { id: true, nombre: true, slug: true },
      orderBy: { nombre: 'asc' },
    });
  }
}