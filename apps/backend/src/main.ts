import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Initialize Fastify adapter for maximum throughput
  const adapter = new FastifyAdapter({
    logger: false, // NestJS handles application logging
    bodyLimit: 1048576, // 1MB body limit
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  // Global pipes & filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS configuration
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Idempotency-Key',
      'X-Action-Token',
      'X-User-Id',
      'X-Signature-SHA256',
      'X-Signature',
    ],
    exposedHeaders: ['Idempotency-Key', 'X-Action-Token'],
  });

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  await app.listen(port, '0.0.0.0');
  logger.log(`High-Concurrency Flash Sale API is running on http://0.0.0.0:${port}`);
}

bootstrap();
