import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger, setupValidation } from './swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcessHandlers } from './core/process-handlers';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const dataSource = app.get(DataSource);

  ProcessHandlers.setup(dataSource);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages:
        process.env.NODE_ENV === 'development' ? false : true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  setupValidation(app);
  setupSwagger(app);

  const port = process.env.PORT || 3000;

  app.enableCors();
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/v1/docs`);
  logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', error);
  process.exit(1);
});
