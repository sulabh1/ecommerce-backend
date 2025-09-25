import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const createDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '', 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'ecommerce',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'false' || !isProduction,
    logging: process.env.DB_LOGGING === 'true' || !isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      connnectionTimeoutMills: 10000,
      idleTimeoutMillis: 30000,
    },
  };
};
