import { IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

export class CrearViajeDto {
  @IsString() @MinLength(2) @MaxLength(80)
  nombre: string;

  @IsUUID()
  destinoId: string;

  @IsString() @Matches(FECHA)
  fechaInicio: string;

  @IsString() @Matches(FECHA)
  fechaFin: string;

  @Type(() => Number)
  @IsNumber() @Min(0)
  presupuesto: number;

  @IsOptional() @IsString() @MaxLength(3)
  moneda?: string;

  @IsOptional() @IsString()
  creadoEn?: string;

  @IsOptional() @IsString()
  actualizadoEn?: string;
}

export class ActualizarViajeDto extends PartialType(CrearViajeDto) {}
