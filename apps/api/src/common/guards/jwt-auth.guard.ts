import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Verifica el token de la cookie. Sin token válido responde 401.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync(token);
      // El rol viaja en el token (dura 24 h): si un admin cambia un rol, aplica desde el próximo login
      req.user = { id: payload.sub, rol: payload.rol };
      return true;
    } catch {
      // Token vencido, manipulado o firmado con otra clave
      throw new UnauthorizedException();
    }
  }
}
