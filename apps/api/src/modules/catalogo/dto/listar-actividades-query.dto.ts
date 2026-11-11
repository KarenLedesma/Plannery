import { TipoActividad } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

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