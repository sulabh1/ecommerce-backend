import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { MailService } from '../mailer/mail.service';
import { JwtAuthService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dts';
import { ErrorHandlerService } from '../errors/error-handler.service';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../errors/custom.errors';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let otpService: OtpService;
  let mailService: MailService;
  let jwtAuthService: JwtAuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockOtpService = {
    generateOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  const mockMailService = {
    sentOtpEmail: jest.fn(),
  };

  const mockJwtAuthService = {
    generateTokens: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUser = {
    id: 'uuid-123',
    email: 'test@example.com',
    firstName: 'rita',
    lastName: 'ora',
    phoneNumber: '+9779809809898',
    isActive: false,
    isEmailVerified: false,
  };

  const mockUserWithPassword = {
    ...mockUser,
    password: '$2b$12$D3YIB8J8/DAfwwkI4IxpLuWeGMZrXkJBusiRJR9gKYJ27PrJ8TpZi',
    isActive: true,
    isEmailVerified: true,
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 900000,
  };

  const mockErrorHandlerService = {
    transformError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtAuthService, useValue: mockJwtAuthService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: MailService, useValue: mockMailService },
        { provide: ErrorHandlerService, useValue: mockErrorHandlerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    otpService = module.get<OtpService>(OtpService);
    mailService = module.get<MailService>(MailService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      firstName: 'rita',
      lastName: 'ora',
      phoneNumber: '+9779809809898',
      password: 'Password12345',
    };

    it('should sign up user successfully', async () => {
      const createdUser = {
        ...mockUser,
        password:
          '$2b$12$D3YIB8J8/DAfwwkI4IxpLuWeGMZrXkJBusiRJR9gKYJ27PrJ8TpZi',
      };

      const expectedUserWithoutPassword = {
        id: 'uuid-123',
        email: 'test@example.com',
        firstName: 'rita',
        lastName: 'ora',
        phoneNumber: '+9779809809898',
        isActive: false,
        isEmailVerified: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);
      mockOtpService.generateOtp.mockResolvedValue('123456');
      mockMailService.sentOtpEmail.mockResolvedValue(undefined);
      mockJwtAuthService.generateTokens.mockResolvedValue(mockTokens);

      const result = await service.signup(signupDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(usersService.create).toHaveBeenCalledWith(signupDto);
      expect(otpService.generateOtp).toHaveBeenCalledWith(
        createdUser.id,
        createdUser.email,
      );
      expect(mailService.sentOtpEmail).toHaveBeenCalledWith(
        createdUser.email,
        '123456',
        `${createdUser.firstName} ${createdUser.lastName}`,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message:
            'Registration successful. Please check your mail for verification Otp',
          tokens: mockTokens,
          user: expectedUserWithoutPassword,
        }),
      );
    });
    it('should throw AuthenticationError if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      await expect(service.signup(signupDto)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should handle errors during OTP generation', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockOtpService.generateOtp.mockRejectedValue(
        new Error('OTP generation failed'),
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'OTP generation failed',
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Password12345',
    };

    it('should login successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtAuthService.generateTokens.mockResolvedValue(mockTokens);

      const result = await service.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUserWithPassword.password,
      );
      expect(result).toEqual({
        message: 'Login successful.',
        tokens: mockTokens,
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          phoneNumber: mockUser.phoneNumber,
          isActive: true,
          isEmailVerified: true,
        }),
      });
      expect(result.user.password).toBeUndefined();
    });

    it('should throw AuthenticationError if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid username or password',
      );
    });
    it('should throw AuthenticationError if password is wrong', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid username or password',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUserWithPassword.password,
      );
    });
    it('should throw AuthenticationError if user is not active and not verified', async () => {
      const inactiveUser = {
        ...mockUserWithPassword,
        isActive: false,
        isEmailVerified: false,
      };
      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      await expect(service.login(loginDto)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'User is not active and verified. Please verify your email',
      );
    });
  });

  describe('verify', () => {
    const verifyEmailDto = {
      email: 'test@example.com',
      otp: '123456',
    };
    it('should verify email successfully', async () => {
      mockOtpService.verifyOtp.mockResolvedValue(true);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      });

      const result = await service.verifyEmail(verifyEmailDto);

      expect(otpService.verifyOtp).toHaveBeenCalledWith(
        verifyEmailDto.email,
        verifyEmailDto.otp,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        verifyEmailDto.email,
      );
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, {
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: expect.any(Date),
      });
      expect(result.message).toBe(
        'Email verified successfully. You can now login.',
      );
    });
    it('should throw AuthenticationError for invalid OTP', async () => {
      mockOtpService.verifyOtp.mockResolvedValue(false);
      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(
        'Invalid or expired OTP',
      );
    });
  });
  describe('resendOtp', () => {
    it('should resend OTP successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockOtpService.generateOtp.mockResolvedValue('123456');
      mockMailService.sentOtpEmail.mockResolvedValue(undefined);

      const result = await service.resendOtp('test@example.com');

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(otpService.generateOtp).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(mailService.sentOtpEmail).toHaveBeenCalledWith(
        mockUser.email,
        '123456',
        `${mockUser.firstName} ${mockUser.lastName}`,
      );
      expect(result.message).toBe('OTP sent successfully');
    });
    it('should throw NotFoundError if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.resendOtp('test@example.com')).rejects.toThrow(
        NotFoundError,
      );
    });
    it('should throw ConflictError if email already verified', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });
      await expect(service.resendOtp('test@example.com')).rejects.toThrow(
        ConflictError,
      );
      await expect(service.resendOtp('test@example.com')).rejects.toThrow(
        'Email is already verified',
      );
    });
  });
});
