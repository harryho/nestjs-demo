import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = {
        access_token: 'jwt-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
      };

      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const result = {
        access_token: 'jwt-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
      };

      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
