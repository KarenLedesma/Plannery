import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UsuarioActual {
  id: string;
  rol: string;
}

// Uso: metodo(@CurrentUser() usuario: UsuarioActual). Devuelve lo que dejó JwtAuthGuard.
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user as UsuarioActual;
});
