import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

// Con la reescritura de Vercel (/api -> backend) el navegador ve un solo sitio,
// así que SameSite=Lax alcanza. Ver docs/decisiones/0004-sesion-con-jwt-en-cookie.md
function cookieOpts() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, usuario } = await this.auth.login(dto);
    // Misma duración que el vencimiento del JWT (24 horas)
    res.cookie('token', token, { ...cookieOpts(), maxAge: 24 * 60 * 60 * 1000 });
    return usuario;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', cookieOpts());
    return { ok: true };
  }
}
