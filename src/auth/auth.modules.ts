import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';
import { AuthController } from './auth.controller';
import { OtpService } from './otp.service';
import { MyMailerModule } from 'src/mailer/mailer.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'fallback-secret-key',
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '15m') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    MyMailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService, OtpService, OtpRepository],
  exports: [JwtAuthService, AuthService, JwtModule],
})
export class AuthModule {}
