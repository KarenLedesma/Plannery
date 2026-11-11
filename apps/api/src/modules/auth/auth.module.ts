import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // getOrThrow: si falta JWT_SECRET el servidor no arranca, en vez de firmar con una clave vacía
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 * 24 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  // Los demás módulos importan AuthModule para poder usar los guards
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
