import { Test, } from '@nestjs/testing'
import { PrismaService } from '../../prisma/prisma.service'
import { ViajesService } from './viajes.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('ViajesService', () => {
  let service: ViajesService
  let prisma: PrismaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ViajesService, PrismaService],
    }).compile()

    service = module.get<ViajesService>(ViajesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('listar', () => {
    it('should list viajes for a user', () => {
      ;(prisma.viaje.findMany as any).mockResolvedValue([])
      const result = service.listar('user-123')
      expect(result).resolves.toEqual([])
    })
  })

  describe('obtener', () => {
    it('should return a viaje if found', async () => {
      ;(prisma.viaje.findFirst as any).mockResolvedValue({ id: 'v-1', nombre: 'Viaje Test' })
      const result = await service.obtener('v-1', 'user-123')
      expect(result).toEqual({ id: 'v-1', nombre: 'Viaje Test' })
    })

    it('should throw NotFoundException if viaje not found', async () => {
      ;(prisma.viaje.findFirst as any).mockResolvedValue(null)
      await expect(service.obtener('v-999', 'user-123')).rejects.toThrow(NotFoundException)
    })
  })

  describe('crear', () => {
    it('should create a viaje with valid data', async () => {
      const dto = {
        nombre: 'Viaje Test',
        destinoId: 'dest-1',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-05',
        presupuesto: 1000,
        moneda: 'USD',
      }
      ;(prisma.viaje.create as any).mockResolvedValue({ id: 'v-1', ...dto, usuarioId: 'user-123' })
      const result = await service.crear(dto, 'user-123')
      expect(result.id).toBe('v-1')
    })

    it('should throw BadRequestException if fechaFin < fechaInicio', async () => {
      const dto = {
        nombre: 'Viaje Test',
        destinoId: 'dest-1',
        fechaInicio: '2024-01-05',
        fechaFin: '2024-01-01',
        presupuesto: 1000,
        moneda: 'USD',
      }
      await expect(service.crear(dto, 'user-123')).rejects.toThrow(BadRequestException)
    })
  })

  describe('actualizar', () => {
    it('should update a viaje', async () => {
      ;(prisma.viaje.update as any).mockResolvedValue({ id: 'v-1', nombre: 'Actualizado' })
      const dto = { nombre: 'Actualizado' }
      const result = await service.actualizar('v-1', dto, 'user-123')
      expect(result.nombre).toBe('Actualizado')
    })

    it('should throw NotFoundException if updating non-existent viaje', async () => {
      ;(prisma.viaje.update as any).mockRejectedValue(new NotFoundException())
      await expect(service.actualizar('v-999', { nombre: 'X' }, 'user-123')).rejects.toThrow(NotFoundException)
    })
  })

  describe('eliminar', () => {
    it('should delete a viaje', async () => {
      ;(prisma.viaje.delete as any).mockResolvedValue({ id: 'v-1' })
      const result = await service.eliminar('v-1', 'user-123')
      expect(result).toEqual({ id: 'v-1' })
    })

    it('should throw NotFoundException if deleting non-existent viaje', async () => {
      ;(prisma.viaje.delete as any).mockRejectedValue(new NotFoundException())
      await expect(service.eliminar('v-999', 'user-123')).rejects.toThrow(NotFoundException)
    })
  })
})