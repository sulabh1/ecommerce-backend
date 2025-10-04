import { Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  AppError,
  DatabaseError,
  EmailError,
  AuthenticationError,
  ConflictError,
  ValidationError,
} from './custom.errors';

@Injectable()
export class ErrorHandlerService {
  // Only used to transform unknown errors to AppError
  transformError(error: any, context?: string): never {
    if (error instanceof AppError) {
      throw error; // Already an AppError, just re-throw
    }

    // Handle TypeORM errors
    if (error instanceof QueryFailedError) {
      const pgError = error as any;

      switch (pgError.code) {
        case '23505':
          throw new ConflictError('Resource already exists');
        case '23503':
          throw new DatabaseError('Referenced resource not found');
        case '23502':
          throw new ValidationError('Required field is missing');
        default:
          throw new DatabaseError('Database operation failed', {
            code: pgError.code,
            context,
          });
      }
    }

    // Handle nodemailer errors
    if (this.isNodemailerError(error)) {
      if (error.code === 'EAUTH') {
        throw new EmailError('Email authentication failed', {
          service: error.service,
          context,
        });
      }
      throw new EmailError('Email delivery failed', {
        code: error.code,
        context,
      });
    }

    // Handle JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }

    // Default fallback
    throw new AppError(
      error.message || 'Internal server error',
      500,
      'INTERNAL_ERROR',
      { context },
    );
  }

  private isNodemailerError(error: any): boolean {
    return error && error.code && error.command;
  }
}
