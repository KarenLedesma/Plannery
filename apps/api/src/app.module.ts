import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// Cada funcionalidad registra su módulo acá con UNA línea en "imports".
// Es el único archivo que tocan todas, por eso los cambios son chicos y fáciles de fusionar.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // AuthModule,          // F1
    // ViajesModule,        // F2
    // ItinerarioModule,    // F2
    // CatalogoModule,      // F3
    // RecomendacionesModule, // F3
    // GastosModule,        // F4
    // ResumenModule,       // F5
  ],
})
export class AppModule {}
