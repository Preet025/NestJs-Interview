import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // instead of declaring the service is where and how
  // simply mention it in auth controller
  // const service = new AuthService()
  // avoid doing it that who manages it and who create it we use dependency injection like in controller

  login() {
    return {
      msg: 'Hello this is signin',
    };
  }
  // hello

  async register(dto: AuthDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: dto.password,
          email: dto.email,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }
}
