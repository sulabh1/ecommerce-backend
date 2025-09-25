/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT Access token',
  })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({
    description: 'Token expiration in milliseconds',
  })
  expiresIn: number;

  @ApiProperty({ description: 'User information' })
  user: UserResponseDto;

  constructor(tokens: any, user: any) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.expiresIn = tokens.expiresIn;
    this.user = new UserResponseDto(user);
  }
}
