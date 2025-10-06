import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const createDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  // For Render.com, we need to always use SSL
  const isRender = !!process.env.DATABASE_URL;

  // Use DATABASE_URL if available (for Render), otherwise use individual settings
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Always false in production
      migrationsRun: true, // Add this to run migrations automatically
      logging: !isProduction,
      ssl: true, // Always true for Render
      extra: {
        ssl: {
          rejectUnauthorized: false, // Required for Render
        },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      },
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  // Fallback to individual settings (for local development)
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '', 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'ecommerce',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Only sync in development
    logging: !isProduction,
    ssl: isProduction,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    },
  };
};
