import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ROLE } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  const authDto = {
    username: 'newuser',
    email: 'existing@example.com',
    password: 'password123',
    role: ROLE.ADMIN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should throw ForbiddenException if user already exists', async () => {
      // Mock prisma create to throw Prisma unique constraint violation
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(
        new PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '4.14.0', // or whatever version you're using
        }),
      );

      await expect(authService.register(authDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
