import { Test, moduleRef } from '@nestjs/testing';
import { ViajesService } from './viajes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ViajesService', () => {
  let service: ViajesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ViajesService, PrismaService],
    }).compile();

    service = module.get<ViajesService>(ViajesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.$reset();
  });

  describe('listar', () => {
    it('debe listar los viajes del usuario', async () => {
      // Arrange - los tests dependen de datos de prueba en la BD
      const result = await service.listar('user-123');
      expect(result).toBeDefined();
    });
  });

  describe('obtener', () => {
    it('debe obtener un viaje por ID', async () => {
      const result = await service.obtener('uuid-123', 'user-123');
      expect(result).toBeDefined();
    });

    it('debe lanzar NotFoundException si el viaje no pertenece al usuario', async () => {
      await expect(service.obtener('uuid-999', 'user-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('crear', () => {
    it('debe crear un viaje con validación de fechas', async () => {
      const dto = {
        nombre: 'Viaje de prueba',
        destinoId: 'dest-1',
        fechaInicio: '2025-01-01',
        fechaFin: '2025-01-07',
        presupuesto: 10000,
        moneda: 'ARS',
      };
      const result = await service.crear(dto as any, 'user-123');
      expect(result.nombre).toBe(dto.nombre);
    });

    it('debe lanzar BadRequestException si la fecha fin es anterior a la inicio', async () => {
      const dto = {
        nombre: 'Viaje inválido',
        destinoId: 'dest-1',
        fechaInicio: '2025-01-07',
        fechaFin: '2025-01-01',
        presupuesto: 10000,
        moneda: 'ARS',
      };
      await expect(service.crear(dto as any, 'user-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('actualizar', () => {
    it('debe actualizar un viaje', async () => {
      const dto = { nombre: 'Viaje actualizado' };
      const result = await service.actualizar('uuid-123', dto as any, 'user-123');
      expect(result.nombre).toBe(dto.nombre);
    });
  });

  describe('eliminar', () => {
    it('debe eliminar un viaje', async () => {
      const result = await service.eliminar('uuid-123', 'user-123');
      expect(result).toBeDefined();
    });
  });
});