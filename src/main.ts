import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger, setupValidation } from './swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api/v1');
  setupValidation(app);
  setupSwagger(app);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application running on:${process.env.PORT}`);
  logger.log(`Swagger documentation:${process.env.PORT}/api`);
}
void bootstrap();
