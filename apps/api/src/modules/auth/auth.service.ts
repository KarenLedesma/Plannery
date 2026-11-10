import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

// Campos que se pueden devolver al cliente. passwordHash nunca sale de acá.
const PUBLICO = { id: true, nombre: true, email: true, rol: true };

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    if (await this.prisma.usuario.findUnique({ where: { email } })) {
      throw new ConflictException('Ese email ya está registrado');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    // El rol no viene del cliente: todo registro público es VIAJERO (el default del esquema)
    return this.prisma.usuario.create({ data: { nombre: dto.nombre, email, passwordHash }, select: PUBLICO });
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email.toLowerCase() } });
    // Mismo mensaje si el email no existe o la contraseña está mal, para no revelar qué emails están registrados
    if (!usuario || !(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const token = await this.jwt.signAsync({ sub: usuario.id, rol: usuario.rol });
    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
  }

  perfil(id: string) {
    return this.prisma.usuario.findUnique({ where: { id }, select: PUBLICO });
  }
}
