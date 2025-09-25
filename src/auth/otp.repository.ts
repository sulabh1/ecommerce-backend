/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {}

  async saveOtp(userData: Partial<Otp>): Promise<Otp> {
    const otpData = this.otpRepository.create({
      userId: userData.userId,
      email: userData.email,
      otp: userData.otp,
      expiresAt: userData.expiresAt,
      isUsed: false,
    });

    return this.otpRepository.save(otpData);
  }
  async findOne(email: string, otp: string): Promise<Otp | null> {
    return this.otpRepository.findOne({
      where: { email, otp, isUsed: false },
      order: { createdAt: 'DESC' },
    });
  }

  async update({ id, isUsed }): Promise<import('typeorm').UpdateResult> {
    return this.otpRepository.update(id, { isUsed });
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt<:now', { now: new Date() })
      .orWhere('isUsed=:isUsed', { isUsed: true })
      .execute();
  }
}
