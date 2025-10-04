import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('otps')
export class Otp extends BaseEntity {
  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ApiProperty({ description: 'Email address' })
  @Column({ name: 'email' })
  @Index()
  email: string;

  @ApiProperty({ description: '6 digit otp code' })
  @Column({ name: 'otp' })
  otp: string;

  @ApiProperty({ description: 'OTP expiration time' })
  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({ description: 'Wheher OTP has been used', default: false })
  @Column({ default: false, name: 'is_used', type: 'boolean' })
  isUsed: boolean;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(partial: Partial<Otp>) {
    super();
    Object.assign(this, partial);
  }
}
