/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sentOtpEmail(
    email: string,
    otp: string,
    userName: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email Address',
        template: 'templates/email-verification',
        context: {
          userName,
          otp,
          expiryMinutes: this.configService.get('OTP_EXPIRY_MINUTES', 10),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
