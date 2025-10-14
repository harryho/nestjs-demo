import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user payload', async () => {
    const payload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: payload.sub,
      username: payload.username,
    });
  });

  it('should throw UnauthorizedException if payload missing sub', async () => {
    const payload = {
      username: 'testuser',
    };

    await expect(strategy.validate(payload)).rejects.toThrow();
  });

  it('should throw UnauthorizedException if payload missing username', async () => {
    const payload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
    };

    await expect(strategy.validate(payload)).rejects.toThrow();
  });

  it('should use JWT secret from config', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });
});
