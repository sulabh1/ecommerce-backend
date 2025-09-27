/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtAuthService, JwtPayload } from './jwt.service';
import { SignupDto } from './dto/signup.dts';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { MailService } from 'src/mailer/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}
  async signup(signupDto: SignupDto): Promise<any> {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      const user = await this.usersService.create(signupDto);

      if (user) {
        const otp = await this.otpService.generateOtp(user?.id!, user?.email!);
        console.log(user.id, 'user data');

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
      console.log(error);
    }
  }

  async verifyEmail(
    VerifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string; user: any }> {
    const { email, otp } = VerifyEmailDto;
    try {
      const isOtpValid = await this.otpService.verifyOtp(email, otp);

      if (!isOtpValid) {
        throw new BadRequestException('Invalid or expired otp');
      }

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new BadRequestException('User not found');
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
      console.log(error);
      return { message: 'Email verification failed', user: null };
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already varified');
      }

      const otp = await this.otpService.generateOtp(user.id, user.email);
      await this.mailService.sentOtpEmail(
        user.email,
        otp || '',
        `${user.firstName} ${user.lastName}`,
      );

      return { message: 'OTP sent successfully' };
    } catch (error) {
      console.log(error);
      return { message: 'Failed to send OTP' };
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
