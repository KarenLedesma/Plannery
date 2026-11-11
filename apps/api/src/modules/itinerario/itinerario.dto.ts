import { IsUUID, IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CrearItinerarioDto {
  @IsUUID()
  actividadId: string;

  @IsString()
  fecha: string;

  @IsOptional()
  orden?: number;

  @IsOptional()
  @IsString()
  nota?: string;
}

export class ActualizarItinerarioDto extends PartialType(CrearItinerarioDto) {}