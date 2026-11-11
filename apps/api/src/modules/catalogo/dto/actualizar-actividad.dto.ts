import { PartialType } from '@nestjs/mapped-types';
import { CrearActividadDto } from './crear-actividad.dto';

// Al editar, todos los campos son opcionales: se manda solo lo que cambia.
export class ActualizarActividadDto extends PartialType(CrearActividadDto) {}