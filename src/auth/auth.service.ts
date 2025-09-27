/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthService, JwtPayload } from './jwt.service';
import { SignupDto } from './dto/signup.dts';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { MailService } from '../mailer/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ErrorHandlerService } from '../errors/error-handler.service';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../errors/custom.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private errorHandler: ErrorHandlerService,
  ) {}
  async signup(signupDto: SignupDto): Promise<any> {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);
      if (existingUser) {
        throw new AuthenticationError('Invalid credentials');
      }
      const user = await this.usersService.create(signupDto);

      if (user) {
        const otp = await this.otpService.generateOtp(user?.id!, user?.email!);

        await this.mailService.sentOtpEmail(
          user.email,
          otp || '',
          `${user.firstName} ${user.lastName}`,
        );
        const tokens = await this.jwtAuthService.generateTokens(
          this.createPayload(user),
        );

        return {
          message:
            'Registration successful. Please check yout mail for verification Otp',
          tokens,
          user,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(
    VerifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string; user: any }> {
    const { email, otp } = VerifyEmailDto;
    try {
      const isOtpValid = await this.otpService.verifyOtp(email, otp);

      if (!isOtpValid) {
        throw new AuthenticationError('Invalid or expired OTP');
      }

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundError('User');
      }

      const updateUser = await this.usersService.update(user.id, {
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      });
      return {
        message: 'Email verified successfully. You can now login.',
        user: updateUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundError('User');
      }

      if (user.isEmailVerified) {
        throw new ConflictError('Email is already verified');
      }

      const otp = await this.otpService.generateOtp(user.id, user.email);
      await this.mailService.sentOtpEmail(
        user.email,
        otp || '',
        `${user.firstName} ${user.lastName}`,
      );

      return { message: 'OTP sent successfully' };
    } catch (error) {
      throw error;
    }
  }
  private createPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
