import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Se usa DESPUÉS de JwtAuthGuard. Si el rol del usuario no está permitido responde 403.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    // Busca @Roles() en el método y, si no hay, en la clase
    const roles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ??
      this.reflector.get<string[]>('roles', ctx.getClass());
    if (!roles?.length) return true;
    const user = ctx.switchToHttp().getRequest().user;
    if (!user || !roles.includes(user.rol)) throw new ForbiddenException('No tenés permiso para esto');
    return true;
  }
}
