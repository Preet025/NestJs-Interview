import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // global will make it available to all modules unlike importing the prisma service to all modules manually
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
