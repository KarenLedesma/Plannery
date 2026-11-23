import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearItinerarioDto {
  @IsString()
  @IsNotEmpty()
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