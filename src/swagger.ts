/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Api with postgres')
    .setDescription('Complete Rest API with swagger documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWt',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('something', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
    },
    customCss: `
  .topbar {
  display:none;
  }
  .swagger-ui .info {margin: 20px 0;}
  `,
    customSiteTitle: 'Ecommerce Api Documentation',
  });
};

export const setupValidation = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
};
