import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ViajesService } from './viajes.service';

@Controller('destinos')
@UseGuards(JwtAuthGuard)
export class DestinosController {
  constructor(private readonly viajes: ViajesService) {}

  @Get()
  listar() {
    return this.viajes.listarDestinos();
  }
}