import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// Mismos valores que los enums del esquema de Prisma (CategoriaGasto y FaseGasto)
export const CATEGORIAS = ['TRANSPORTE', 'ALOJAMIENTO', 'COMIDA', 'ACTIVIDADES', 'OTROS'] as const;
export const FASES = ['ANTES', 'DURANTE', 'DESPUES'] as const;
export type Categoria = (typeof CATEGORIAS)[number];
export type Fase = (typeof FASES)[number];

export class CrearGastoDto {
  @IsString() @MinLength(2) @MaxLength(120)
  descripcion: string;

  @IsIn(CATEGORIAS)
  categoria: Categoria;

  @IsIn(FASES)
  fase: Fase;

  // Dinero con 2 decimales como máximo (la columna es Decimal(12,2))
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(999999999)
  montoEstimado: number;

  // Queda vacío hasta que el gasto se hace efectivo. Mandar null lo vuelve a vaciar.
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(999999999)
  montoReal?: number | null;

  @IsOptional() @IsDateString()
  fecha?: string;

  @IsOptional() @IsString() @MaxLength(300)
  nota?: string;
}

export class ActualizarGastoDto extends PartialType(CrearGastoDto) {}

export class FiltroGastosDto {
  @IsOptional() @IsIn(FASES)
  fase?: Fase;

  @IsOptional() @IsIn(CATEGORIAS)
  categoria?: Categoria;
}
