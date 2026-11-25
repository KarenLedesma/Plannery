import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function getFrontendOrigin(): string | string[] {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const origins = frontendUrl.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  return origins.length > 1 ? origins : origins[0];
}

function getCorsOptions() {
  const origin = getFrontendOrigin();
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    origin: typeof origin === 'string' ? origin : origin[0],
    credentials: true,
    ...(isProduction
      ? {
          sameSite: 'none' as const,
          secure: true,
        }
      : {}),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors(getCorsOptions());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
