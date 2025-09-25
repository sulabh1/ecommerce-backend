/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Otp } from 'src/auth/entities/otp.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true, name: 'email' })
  @Index()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    description: 'User password (hashed)',
    example: '$2b$12$hashedpassword',
    writeOnly: true,
  })
  @Column({ name: 'password' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.USER,
  })
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Whether the user is active',
    example: true,
    default: true,
  })
  @Column({ default: false, name: 'is_active' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  @Column({ nullable: true, name: 'phone_number' })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @Column({ default: false, name: 'is_email_verified' })
  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean;

  @Column({ nullable: true, name: 'email_verified_al' })
  emailVerifiedAt: Date;

  @ApiProperty({
    description: 'User full name',
    example: 'John doe',
  })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
