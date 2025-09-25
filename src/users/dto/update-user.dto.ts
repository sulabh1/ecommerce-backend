import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain letters',
  })
  firstName?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain letters',
  })
  lastName?: string;

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
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'User verified at which time',
    example: 'John',
  })
  @IsBoolean()
  @IsOptional()
  emailVerifiedAt?: Date;

  @ApiProperty({
    description: 'User is active or not',
    example: 'John',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
