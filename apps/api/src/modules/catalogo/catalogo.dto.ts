import { PartialType } from '@nestjs/mapped-types';
import { TipoActividad } from '@prisma/client';
import { Transform } from 'class-transformer';
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

// Al editar, todos los campos son opcionales: se manda solo lo que cambia.
export class ActualizarActividadDto extends PartialType(CrearActividadDto) {}

export class ListarActividadesQueryDto {
  @IsOptional()
  @IsUUID()
  destinoId?: string;

  @IsOptional()
  @IsEnum(TipoActividad)
  tipo?: TipoActividad;

  // En la URL todo llega como texto ("true" / "false"), así que hay que convertirlo
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  activa?: boolean;
}