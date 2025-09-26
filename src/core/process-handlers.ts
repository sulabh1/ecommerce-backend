/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class ProcessHandlers {
  private static readonly logger = new Logger(ProcessHandlers.name);
  static process: any;

  static setup(dataSource: DataSource) {
    process.on('uncaughtException', (error: Error) => {
      this.process.error(`Uncaught Exception: ${error.message}`, error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logger.error(`Unhandled Rejection at: ${promise}, reason:${reason}`);
      process.exit(1);
    });

    const gracefulShutdown = async (signal: string) => {
      this.logger.log(`Received ${signal}. Starting graceful shutdownm...`);

      try {
        if (dataSource.isInitialized) {
          await dataSource.destroy();
          this.logger.log('Database connection closed.');
        }

        this.logger.log('Graceful shutdown completed.');
        process.exit(0);
      } catch (error) {
        this.logger.error('Error during graceful shutdown:', error);
      }
    };
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    process.on('exit', (code) => {
      this.logger.log(`Process.exited with code :${code}`);
    });
  }
}
