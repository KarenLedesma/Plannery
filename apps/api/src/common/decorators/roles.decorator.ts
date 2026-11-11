import { SetMetadata } from '@nestjs/common';

// Uso: @Roles('ADMIN') sobre una ruta o un controlador. Lo lee RolesGuard.
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
