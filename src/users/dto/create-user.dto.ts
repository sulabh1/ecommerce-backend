/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsStrongPassword,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain letters',
  })
  firstName: string;

  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain letters',
  })
  lastName: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
    minLength: 8,
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User verified or not',
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'User verified at which time',
    example: 'John',
  })
  @IsBoolean()
  @IsOptional()
  emailVerifiedAt: Date;

  @ApiProperty({
    description: 'User is active or not',
    example: 'John',
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
