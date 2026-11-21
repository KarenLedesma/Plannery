import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CrearItinerarioDto {
  @IsUUID()
  actividadId!: string;

  @IsDateString()
  fecha!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nota?: string;
}

export class ActualizarItinerarioDto extends PartialType(CrearItinerarioDto) {}