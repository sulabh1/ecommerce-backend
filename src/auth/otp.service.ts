/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import { OtpRepository } from './otp.repository';
import { ConfigService } from '@nestjs/config';
import otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly configService: ConfigService,
  ) {}

  async generateOtp(
    userId: string,
    email: string,
  ): Promise<string | undefined> {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTE',
      10,
    );

    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    const userData = {
      userId,
      email,
      otp,
      expiresAt,
      isUsed: false,
    };
    try {
      await this.otpRepository.saveOtp(userData);

      return otp;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const otpRecord = await this.otpRepository.findOne(email, otp);

      if (!otpRecord) {
        return false;
      }

      if (new Date() > otpRecord.expiresAt) {
        return false;
      }

      await this.otpRepository.update({ id: otpRecord.id, isUsed: true });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepository.cleanupExpiredOtps();
  }
}
