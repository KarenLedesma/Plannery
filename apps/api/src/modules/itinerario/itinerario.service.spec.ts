import { Test, moduleRef } from '@nestjs/testing';
import { ItinerarioService } from './itinerario.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ItinerarioService', () => {
  let service: ItinerarioService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ItinerarioService, PrismaService],
    }).compile();

    service = module.get<ItinerarioService>(ItinerarioService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.$reset();
  });

  describe('listarItinerario', () => {
    it('debe listar el itinerario de un viaje', async () => {
      const result = await service.listarItinerario('uuid-123');
      expect(result).toBeDefined();
    });
  });

  describe('crearItinerarioItem', () => {
    it('debe crear un ítem de itinerario', async () => {
      const dto = { actividadId: 'act-1', fecha: '2025-01-01' };
      const result = await service.crearItinerarioItem('uuid-123', dto as any);
      expect(result).toBeDefined();
    });
  });

  describe('actualizarItinerarioItem', () => {
    it('debe actualizar un ítem de itinerario', async () => {
      const dto = { actividadId: 'act-1', fecha: '2025-01-01', notas: 'Nota de prueba' };
      const result = await service.actualizarItinerarioItem('uuid-123', 'item-1', dto as any);
      expect(result).toBeDefined();
    });
  });

  describe('eliminarItinerarioItem', () => {
    it('debe eliminar un ítem de itinerario', async () => {
      const result = await service.eliminarItinerarioItem('uuid-123', 'item-1');
      expect(result).toBeDefined();
    });
  });
});