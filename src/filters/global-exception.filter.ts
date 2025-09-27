/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../errors/custom.errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorCode: string;
    let details: any;

    // Handle our custom AppError
    if (exception instanceof AppError) {
      status = exception.statusCode;
      message = exception.message;
      errorCode = exception.errorCode;
      details = exception.details;
    }
    // Handle TypeORM errors
    else if (exception instanceof QueryFailedError) {
      const error = exception as any;
      const result = this.handleDatabaseError(error);
      status = result.status;
      message = result.message;
      errorCode = result.errorCode;
      details = result.details;
    }
    // Handle JWT errors
    else if (exception instanceof TokenExpiredError) {
      status = 401;
      message = 'Token has expired';
      errorCode = 'TOKEN_EXPIRED';
    } else if (exception instanceof JsonWebTokenError) {
      status = 401;
      message = 'Invalid token';
      errorCode = 'INVALID_TOKEN';
    }
    // Handle NestJS HTTP exceptions
    else if (exception instanceof Error && 'getStatus' in exception) {
      const httpException = exception as any;
      status = httpException.getStatus();
      message = httpException.message;
      errorCode = 'HTTP_ERROR';

      // Handle class-validator errors
      if (httpException.getResponse) {
        const response = httpException.getResponse();
        if (typeof response === 'object' && 'message' in response) {
          message = Array.isArray(response.message)
            ? response.message[0]
            : response.message;
          details = response.message;
        }
      }
    }
    // Handle nodemailer errors
    else if (this.isNodemailerError(exception)) {
      const result = this.handleNodemailerError(exception);
      status = result.status;
      message = result.message;
      errorCode = result.errorCode;
      details = result.details;
    }
    // Handle all other errors
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorCode = 'INTERNAL_ERROR';
    }

    // Log the error
    this.logError(request, exception);

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: message,
        details: details,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }

  private handleDatabaseError(error: any): {
    status: number;
    message: string;
    errorCode: string;
    details?: any;
  } {
    switch (error.code) {
      case '23505': // Unique violation
        return {
          status: 409,
          message: 'Resource already exists',
          errorCode: 'UNIQUE_VIOLATION',
          details: { constraint: error.constraint },
        };
      case '23503': // Foreign key violation
        return {
          status: 400,
          message: 'Referenced resource not found',
          errorCode: 'FOREIGN_KEY_VIOLATION',
        };
      case '23502': // Not null violation
        return {
          status: 400,
          message: 'Required field is missing',
          errorCode: 'NOT_NULL_VIOLATION',
        };
      case '22P02': // Invalid text representation
        return {
          status: 400,
          message: 'Invalid data format',
          errorCode: 'INVALID_INPUT',
        };
      default:
        return {
          status: 500,
          message: 'Database operation failed',
          errorCode: 'DATABASE_ERROR',
          details: { code: error.code },
        };
    }
  }

  private handleNodemailerError(error: any): {
    status: number;
    message: string;
    errorCode: string;
    details?: any;
  } {
    switch (error.code) {
      case 'EAUTH':
        return {
          status: 500,
          message: 'Email authentication failed',
          errorCode: 'EMAIL_AUTH_ERROR',
          details: { service: error.service },
        };
      case 'EENVELOPE':
        return {
          status: 400,
          message: 'Invalid email parameters',
          errorCode: 'EMAIL_VALIDATION_ERROR',
        };
      case 'ECONNECTION':
        return {
          status: 500,
          message: 'Email service connection failed',
          errorCode: 'EMAIL_CONNECTION_ERROR',
        };
      default:
        return {
          status: 500,
          message: 'Email delivery failed',
          errorCode: 'EMAIL_ERROR',
          details: { code: error.code },
        };
    }
  }

  private isNodemailerError(error: any): boolean {
    return error && error.code && error.command;
  }

  private logError(request: Request, exception: unknown): void {
    console.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
    });
  }
}
