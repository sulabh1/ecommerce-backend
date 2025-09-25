/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'john' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'doe' })
  lastName: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John doe',
  })
  fullName: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'whether the user is active or not',
    example: 'true',
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.role = user.role;
    this.isActive = user.isActive;
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
