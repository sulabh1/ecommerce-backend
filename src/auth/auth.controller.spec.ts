import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
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
    fullName: 'test test',
    role: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 900000,
  };

  const mockSignupResponse = {
    tokens: mockTokens,
    user: mockUser,
    message:
      'Registration successful. Please check your mail for verification.',
  };

  const mockLoginResponse = {
    message: 'Login successful',
    tokens: mockTokens,
    user: mockUser,
  };

  const mockVerifyEmailResponse = {
    message: 'Email verified successfully. You can now login.',
    user: mockUser,
  };

  const mockResendOtpResponse = {
    message: 'Otp sent successfully',
  };

  const mockAuthResponse = new AuthResponseDto(mockTokens, mockUser);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });
  describe('signup', () => {
    const signUpDto: SignupDto = {
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'test',
      phoneNumber: '+9779809809898',
      password: 'Password@12345',
    };

    it('should create a new user and return auth response', async () => {
      //   const serviceResponse = {
      //     token: mockTokens,
      //     user: mockUser,
      //     message:
      //       'Registration successful. Please check your mail for verification',
      //   };
      mockAuthService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(signUpDto);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.accessToken).toEqual(mockTokens.accessToken);
      expect(result.refreshToken).toEqual(mockTokens.refreshToken);
      expect(result.user).toEqual(mockUser);
    });

    it('should handle conflict error when email exists', async () => {
      mockAuthService.signup.mockRejectedValue(
        new ConflictError('Email already exists'),
      );

      await expect(controller.signup(signUpDto)).rejects.toThrow(ConflictError);
      //   await expect(controller.signup(signUpDto)).rejects.toThrow(
      //     'Email already exists',
      //   );
      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
    });

    // it('should handle authentioncation errors during signup', async () => {
    //   mockAuthService.signup.mockRejectedValue(
    //     new AuthenticationError('Invalid credentials'),
    //   );
    //   await expect(controller.signup(signUpDto)).rejects.toThrow(
    //     AuthenticationError,
    //   );
    //   expect(authService.signup).toHaveBeenCalledWith(signUpDto);
    // });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'Password@12345',
    };
    it('should login user and return response', async () => {
      const serviceResponse = {
        message: 'Login successful',
        tokens: mockTokens,
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
      expect(result).not.toHaveProperty('password');
    });

    it('should handle authentication errors during login', async () => {
      mockAuthService.login.mockRejectedValue(
        new AuthenticationError('Invalid username or password'),
      );
      await expect(controller.login(loginDto)).rejects.toThrow(
        AuthenticationError,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('verifyEmail', () => {
    const verifyEmailDto: VerifyEmailDto = {
      email: 'test@test.com',
      otp: '123456',
    };
    it('should verify email successfully', async () => {
      //   const serviceResponse = {
      //     message: 'Email verified successfully. You can now login.',
      //     user: mockUser,
      //   };
      mockAuthService.verifyEmail.mockResolvedValue(mockVerifyEmailResponse);
      const result = await controller.verifyEmail(verifyEmailDto);
      expect(authService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto);
      expect(result).toEqual(mockVerifyEmailResponse);
    });

    it('should handle authentication errors for invalid otp', async () => {
      mockAuthService.verifyEmail.mockRejectedValue(
        new AuthenticationError('Invalid or expired OTP'),
      );
      await expect(controller.verifyEmail(verifyEmailDto)).rejects.toThrow(
        AuthenticationError,
      );
      expect(authService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto);
    });
  });

  describe('resendOtp', () => {
    const resendOtpDto: ResendOtpDto = {
      email: 'test@test.com',
    };
    it('should resend OTP successfully', async () => {
      //   const serviceResponse = {
      //     message: 'OTP sent successfully',
      //   };
      mockAuthService.resendOtp.mockResolvedValue(mockResendOtpResponse);
      const result = await controller.resendOtp(resendOtpDto);
      expect(authService.resendOtp).toHaveBeenCalledWith(resendOtpDto.email);
      expect(result).toEqual(mockResendOtpResponse);
    });

    it('should handle not found error when user doesnot exist', async () => {
      mockAuthService.resendOtp.mockRejectedValue(
        new NotFoundError('User not found'),
      );
      await expect(controller.resendOtp(resendOtpDto)).rejects.toThrow(
        NotFoundError,
      );
      expect(authService.resendOtp).toHaveBeenCalledWith(resendOtpDto.email);
    });
    // it('should handle conflict error when email is already verified', async () => {
    //   mockAuthService.resendOtp.mockRejectedValue(
    //     new ConflictError('Email is already verified'),
    //   );
    //   await expect(controller.resendOtp(resendOtpDto)).rejects.toThrow(
    //     ConflictError,
    //   );
    //   expect(authService.resendOtp).toHaveBeenCalledWith(resendOtpDto.email);
    // });
  });

  describe('HTTP Response Structure', () => {
    it('should return AuthResponseDto for signup', async () => {
      const signupDto: SignupDto = {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '+9779809809898',
        password: 'Test@12345',
      };
      //   const serviceResponse = {
      //     tokens: mockTokens,
      //     user: mockUser,
      //     message:
      //       'Registration successfull. Please check your mail for verification',
      //   };
      mockAuthService.signup.mockResolvedValue(mockSignupResponse);
      const result = await controller.signup(signupDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.accessToken).toEqual(mockTokens.accessToken);
      expect(result.refreshToken).toEqual(mockTokens.refreshToken);
      expect(result.expiresIn).toBe(mockTokens.expiresIn);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.firstName).toBe(mockUser.firstName);
    });
    it('should return proper message format for login', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'Test@12345',
      };
      //   const serviceResponse = {
      //     message: 'Login successfully',
      //     token: mockTokens,
      //     user: mockUser,
      //   };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result.message).toBe('Login successful');
      expect(result.tokens).toEqual(mockTokens);
      expect(result.user).toEqual(mockUser);
    });
  });
});
