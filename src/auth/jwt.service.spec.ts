import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService, JwtPayload, Tokens } from './jwt.service';
import { JwtService } from '@nestjs/jwt';

describe('JWTAuthService', () => {
  let service: JwtAuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockPayload: JwtPayload = {
    sub: 'user-123',
    email: 'test@test.com',
    role: 'user',
  };

  const mockTokens: Tokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 900000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });
  describe('generateTokens', () => {
    it('should generate tokens successfully', async () => {
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('7d')
        .mockReturnValueOnce('15m');
      const result = await service.generateTokens(mockPayload);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, mockPayload);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, mockPayload, {
        expiresIn: '7d',
      });
      //console.log(result, 'mocked payload');
      expect(configService.get).toHaveBeenCalledTimes(2);
      expect(configService.get).toHaveBeenNthCalledWith(
        1,
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      );
      expect(configService.get).toHaveBeenNthCalledWith(
        2,
        'JWT_EXPIRES_IN',
        '15md',
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900000,
      });
    });
  });
  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);
      const result = await service.verifyToken('valid-token');
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('should handle invalid token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));
      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid token',
      );
    });
  });
  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      jest.spyOn(service, 'verifyToken').mockResolvedValue(mockPayload);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens);
      const result = await service.refreshToken('valid-refresh-token');
      expect(service.verifyToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(service.generateTokens).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockTokens);
    });

    it('should handle invalid refresh token', async () => {
      jest
        .spyOn(service, 'verifyToken')
        .mockRejectedValue(new Error('Invalid token'));
      await expect(
        service.refreshToken('invalid-refresh-token'),
      ).rejects.toThrow('Invalid token');
    });
  });

  describe('parseExpiresIn', () => {
    it('should parse seconds correctly', () => {
      const result = service['parseExpiresIn']('30s');
      expect(result).toBe(30000);
    });

    it('should parse minutes correctly', () => {
      const result = service['parseExpiresIn']('15m');
      expect(result).toBe(900000);
    });
    it('should parse hours correctly', () => {
      const result = service['parseExpiresIn']('2h');
      expect(result).toBe(7200000);
    });
    it('should parse days correctly', () => {
      const result = service['parseExpiresIn']('7d');
      expect(result).toBe(604800000);
    });
    it('should return default for unknown unit', () => {
      const result = service['parseExpiresIn']('15x');
      expect(result).toBe(900000);
    });
  });
});
