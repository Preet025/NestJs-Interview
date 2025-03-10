import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MockApiService } from './mock-api.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(), // For cron job that handles auto-retries
  ],
  controllers: [IngestionController],
  providers: [IngestionService, MockApiService],
})
export class IngestionModule {}
