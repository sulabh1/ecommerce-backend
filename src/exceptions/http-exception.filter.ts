import { HttpException, HttpStatus } from '@nestjs/common';

export class AppHttpException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public errorCode: string,
    public detail?: any,
  ) {
    super(message, status);
  }
}

export class EmailException extends AppHttpException {
  constructor(message: string = 'Email service error', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'EMAIL_ERROR', details);
  }
}

export class DatabaseException extends AppHttpException {
  constructor(message: string = 'Database error', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', details);
  }
}

export class AuthException extends AppHttpException {
  constructor(message: string = 'Authentication error', details?: any) {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTH_ERROR', details);
  }
}
