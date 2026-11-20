import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogoService } from './catalogo.service';

// Coordenadas como las devuelve Prisma: objetos Decimal con toNumber()
const decimal = (n: number) => ({ toNumber: () => n });

const actividadBase = {
  id: 'a1',
  nombre: 'Museo',
  tipo: 'INTERIOR',
  activa: true,
  latitud: decimal(-34.6),
  longitud: null,
};

describe('CatalogoService', () => {
  let prisma: any;
  let service: CatalogoService;

  beforeEach(() => {
    prisma = {
      actividad: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      destino: { findUnique: jest.fn() },
      itinerarioItem: { count: jest.fn() },
    };
    service = new CatalogoService(prisma as unknown as PrismaService);
  });

  describe('listar', () => {
    it('al viajero solo le muestra las activas, aunque pida ver las archivadas', async () => {
      prisma.actividad.findMany.mockResolvedValue([]);

      await service.listar(
        { destinoId: 'd1', tipo: 'INTERIOR', activa: false } as any,
        { id: 'u1', rol: 'VIAJERO' } as any,
      );

      expect(prisma.actividad.findMany).toHaveBeenCalledWith({
        where: { destinoId: 'd1', tipo: 'INTERIOR', activa: true },
        orderBy: { nombre: 'asc' },
      });
    });

    it('al admin le deja filtrar por activa', async () => {
      prisma.actividad.findMany.mockResolvedValue([]);

      await service.listar({ destinoId: 'd1', activa: false } as any, { id: 'u2', rol: 'ADMIN' } as any);

      expect(prisma.actividad.findMany).toHaveBeenCalledWith({
        where: { destinoId: 'd1', tipo: undefined, activa: false },
        orderBy: { nombre: 'asc' },
      });
    });

    it('pasa las coordenadas Decimal a número y deja null si no hay', async () => {
      prisma.actividad.findMany.mockResolvedValue([actividadBase]);

      const [resultado] = await service.listar({} as any, { id: 'u1', rol: 'VIAJERO' } as any);

      expect(resultado.latitud).toBe(-34.6);
      expect(resultado.longitud).toBeNull();
    });
  });

  describe('crear', () => {
    it('rechaza con 400 si el destino no existe y no crea nada', async () => {
      prisma.destino.findUnique.mockResolvedValue(null);

      await expect(service.crear({ destinoId: 'inexistente' } as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.actividad.create).not.toHaveBeenCalled();
    });
  });

  describe('actualizar', () => {
    it('responde 404 si la actividad no existe', async () => {
      prisma.actividad.findUnique.mockResolvedValue(null);

      await expect(service.actualizar('x', { nombre: 'Nuevo' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.actividad.update).not.toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('archiva la actividad si ya está en un itinerario', async () => {
      prisma.actividad.findUnique.mockResolvedValue(actividadBase);
      prisma.itinerarioItem.count.mockResolvedValue(2);

      const resultado = await service.eliminar('a1');

      expect(prisma.actividad.update).toHaveBeenCalledWith({ where: { id: 'a1' }, data: { activa: false } });
      expect(prisma.actividad.delete).not.toHaveBeenCalled();
      expect(resultado).toEqual({ id: 'a1', accion: 'archivada' });
    });

    it('la borra de verdad si nadie la usa', async () => {
      prisma.actividad.findUnique.mockResolvedValue(actividadBase);
      prisma.itinerarioItem.count.mockResolvedValue(0);

      const resultado = await service.eliminar('a1');

      expect(prisma.actividad.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
      expect(resultado).toEqual({ id: 'a1', accion: 'eliminada' });
    });

    it('responde 404 si no existe', async () => {
      prisma.actividad.findUnique.mockResolvedValue(null);

      await expect(service.eliminar('x')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});