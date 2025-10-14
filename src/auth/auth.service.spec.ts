import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
    });

    it('should throw ConflictException if username exists', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token', 'jwt-token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(
        service.login({
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
