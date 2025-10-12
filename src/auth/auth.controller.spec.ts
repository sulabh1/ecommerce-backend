import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dts';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import {
  ConflictError,
  AuthenticationError,
  NotFoundError,
} from '../errors/custom.errors';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
    resendOtp: jest.fn(),
  };

  const mockUser = {
    id: 'uuid-123',
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'test',
    phoneNumber: '+9779809809898',
    isActive: true,
    isEmailVerified: true,
  };
});
