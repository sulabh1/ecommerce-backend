/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ArgumentsHost,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string | object;
    let errorCode: string;

    if (exception instanceof QueryFailedError) {
      const pgError = exception as any;

      switch (pgError.code) {
        case '23505': //Unique violation
          status = HttpStatus.CONFLICT;
          message = 'Resource already exist';
          errorCode = 'UNIQUE_VIOLATION';
          break;

        case '23503': //Foreign key violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Referenced resource not found';
          errorCode = 'FOREIGN_KEY_VIOLATION';
          break;

        case '20502': //Not null violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Required field is missing';
          errorCode = 'NOT_NULL_VIOLATION';
          break;

        case '22p02': //Invalid text representation
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid data format';
          errorCode = 'INVALID_NPUT';
          break;

        case '42703': //Undefined column
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database configuration error';
          errorCode = 'UNDEFINED_COLUMN';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database error occurred';
          errorCode = 'DATABASE_ERROR';
      }
      this.logger.error(`Database Error [${pgError.code}]:${pgError.message}`);
    } else if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Token has expired';
      errorCode = 'TOKEN_EXPIRED';
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
      errorCode = 'INVALID_TOKEN';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      errorCode = 'HTTP_ERROR';
    } else if (this.isNodemailerError(exception)) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Email service temprory unavailable';
      errorCode = 'EMAIL_SERVICE_ERROR';
      this.logger.error(`Nodemailer Error: ${(exception as Error).message}`);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorCode = 'INTERNAL_ERROR';
      this.logger.error(`Unexpected Error: ${exception}`);
    }
    this.logError(request, exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      errorCode: errorCode,
    });
  }

  private isNodemailerError(error: any): boolean {
    return (
      error &&
      typeof error.message === 'string' &&
      (error.code !== undefined || error.command !== undefined)
    );
  }

  private logError(request: Request, exception: unknown): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      exception:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
    };
    this.logger.error(JSON.stringify(errorLog));
  }
}
