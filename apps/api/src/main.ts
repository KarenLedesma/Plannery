import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  // CORS solo para el dominio del frontend y con cookies. Nunca "*" con credenciales.
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  // Descarta campos que no están en el DTO y rechaza los desconocidos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
