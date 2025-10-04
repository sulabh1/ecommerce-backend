import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { createDatabaseConfig } from './configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

const nestConfig = createDatabaseConfig() as any;

// Convert NestJS TypeORM config to TypeORM DataSource config
export const dataSourceOptions = {
  type: 'postgres',
  host: nestConfig.host,
  port: nestConfig.port,
  username: nestConfig.username,
  password: nestConfig.password,
  database: nestConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // Always false for migrations
  logging: nestConfig.logging,
  ssl: nestConfig.ssl,
  namingStrategy: new SnakeNamingStrategy(),
};

// Create and export the DataSource instance
const dataSource = new DataSource(dataSourceOptions as any);
export default dataSource;
