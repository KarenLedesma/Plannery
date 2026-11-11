import { TipoActividad } from '@prisma/client';
import {
  IsBoolean, IsEnum, IsLatitude, IsLongitude,
  IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength,
} from 'class-validator';

export class CrearActividadDto {
  @IsUUID()
  destinoId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsEnum(TipoActividad)
  tipo!: TipoActividad;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsLatitude()
  latitud?: number;

  @IsOptional()
  @IsLongitude()
  longitud?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}