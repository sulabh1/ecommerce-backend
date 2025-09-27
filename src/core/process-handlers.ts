/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-misused-promises */
// src/core/process-handlers.ts
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class ProcessHandlers {
  private static readonly logger = new Logger(ProcessHandlers.name);

  static setup(dataSource: DataSource) {
    process.on('uncaughtException', (error: Error) => {
      this.logger.error(`Uncaught Exception: ${error.message}`, error.stack);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logger.error(
        `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      );
    });

    const gracefulShutdown = async (signal: string) => {
      this.logger.log(`Received ${signal}. Starting graceful shutdown...`);

      try {
        if (dataSource.isInitialized) {
          await dataSource.destroy();
          this.logger.log('Database connection closed.');
        }

        this.logger.log('Graceful shutdown completed.');
        process.exit(0);
      } catch (error) {
        this.logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  }
}
