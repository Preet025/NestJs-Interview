import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { ROLE } from 'src/common/enums/role.enum'; // ✅ use only one import
import { ROLE } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    username: 'testuser',
    role: ROLE.ADMIN,
  };

  const mockResult = {
    status: 'success',
    message: 'User verified',
    user: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      role: ROLE.ADMIN,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should login user', async () => {
    jest.spyOn(authService, 'login').mockResolvedValue(mockUser);
    const result = await authController.login({
      email: 'test@example.com', // ✅ fixed from username
      password: 'testpass',
    });
    expect(result).toEqual(mockUser);
  });

  it('should verify user', async () => {
    jest.spyOn(authService, 'verify').mockResolvedValue(mockResult);
    const result = await authController.verify({
      token: 'sometoken',
      email: 'test@example.com', // ✅ added email
    });
    expect(result).toEqual(mockResult);
  });
});
