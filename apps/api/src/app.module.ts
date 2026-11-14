import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ViajesModule } from './modules/viajes/viajes.module';
import { CatalogoModule } from './modules/catalogo/catalogo.module';

// Cada funcionalidad registra su módulo acá con UNA línea en "imports".
// Es el único archivo que tocan todas, por eso los cambios son chicos y fáciles de fusionar.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule, // F1
    ViajesModule, // F2
    // ItinerarioModule,    // F2
    CatalogoModule,
    // RecomendacionesModule, // F3
    // GastosModule,        // F4
    // ResumenModule,       // F5
  ],
})
export class AppModule {}
