import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockApiService } from './mock-api.service';
import { CreateIngestionDto } from './dto';
import { Ingestion, STATUS, ROLE } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private prisma: PrismaService,
    private mockApiService: MockApiService,
  ) {}

  async triggerIngestion(createIngestionDto: CreateIngestionDto, userId: number): Promise<Ingestion> {
    // Create an ingestion record with PENDING status
    const ingestion = await this.prisma.ingestion.create({
      data: {
        status: STATUS.PENDING,
        source: createIngestionDto.source,
        destination: createIngestionDto.destination,
        metadata: createIngestionDto.metadata || {},
        userId,
      },
    });

    // Start the ingestion process asynchronously
    this.processIngestion(ingestion.id).catch(error => {
      this.logger.error(`Error in ingestion process: ${(error as Error).message}`, (error as Error).stack);
    });

    return ingestion;
  }

  async getIngestionStatus(id: number, userId: number): Promise<Ingestion> {
    const ingestion = await this.prisma.ingestion.findUnique({
      where: { id },
    });

    if (!ingestion) {
      throw new NotFoundException(`Ingestion with ID ${id} not found`);
    }

    // Check if user has permission to view this ingestion
    // Only the creator or an admin can view
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (ingestion.userId !== userId && user.role !== ROLE.ADMIN) {
      throw new ForbiddenException('You do not have permission to access this ingestion');
    }

    return ingestion;
  }

  async getAllIngestions(userId: number): Promise<Ingestion[]> {
    // Get user role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If admin, return all ingestions
    if (user.role === ROLE.ADMIN) {
      return this.prisma.ingestion.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    // Otherwise, return only user's ingestions
    return this.prisma.ingestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async retryIngestion(id: number, userId: number): Promise<Ingestion> {
    const ingestion = await this.prisma.ingestion.findUnique({
      where: { id },
    });

    if (!ingestion) {
      throw new NotFoundException(`Ingestion with ID ${id} not found`);
    }

    // Only allow retrying failed ingestions
    if (ingestion.status !== STATUS.FAILED) {
      throw new ForbiddenException(`Cannot retry ingestion with status: ${ingestion.status}`);
    }

    // Check if user has permission to retry this ingestion
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (ingestion.userId !== userId && user.role !== ROLE.ADMIN) {
      throw new ForbiddenException('You do not have permission to retry this ingestion');
    }

    // Reset the status to PENDING and increment retries
    const updated = await this.prisma.ingestion.update({
      where: { id },
      data: {
        status: STATUS.PENDING,
        retries: {
          increment: 1,
        },
        error: null,
      },
    });

    // Start the ingestion process asynchronously
    this.processIngestion(updated.id).catch(error => {
      this.logger.error(`Error in ingestion retry: ${(error as Error).message}`, (error as Error).stack);
    });

    return updated;
  }

  private async processIngestion(id: number): Promise<void> {
    try {
      // Mark ingestion as IN_PROGRESS
      const ingestion = await this.prisma.ingestion.update({
        where: { id },
        data: { status: STATUS.IN_PROGRESS },
      });

      // Call the mock API service
      const result = await this.mockApiService.processIngestion(
        ingestion.source,
        ingestion.destination,
        ingestion.metadata,
      );

      if (result.success) {
        // Update ingestion record with success status
        await this.prisma.ingestion.update({
          where: { id },
          data: {
            status: STATUS.COMPLETED,
            completedAt: new Date(),
            metadata: {
              ...(ingestion.metadata as object),
              result: result.data,
            },
          },
        });
        this.logger.log(`Ingestion ${id} completed successfully`);
      } else {
        // Update ingestion record with failure status
        await this.prisma.ingestion.update({
          where: { id },
          data: {
            status: STATUS.FAILED,
            error: result.message,
          },
        });
        this.logger.warn(`Ingestion ${id} failed: ${result.message}`);
      }
    } catch (error) {
      // Handle unexpected errors
      await this.prisma.ingestion.update({
        where: { id },
        data: {
          status: STATUS.FAILED,
          error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      });
      this.logger.error(
        `Ingestion ${id} failed with exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  // Run every minute to check for failed ingestions that need auto retry
  @Cron('0 * * * * *')
  async handleAutoRetries() {
    this.logger.debug('Checking for failed ingestions to auto-retry');

    // Find failed ingestions that haven't exceeded max retries
    const failedIngestions = await this.prisma.ingestion.findMany({
      where: {
        status: STATUS.FAILED,
      },
    });

    // Filter in memory those that haven't exceeded max retries
    const ingestionsToRetry = failedIngestions.filter(ingestion => ingestion.retries < ingestion.maxRetries);

    for (const ingestion of ingestionsToRetry) {
      this.logger.log(
        `Auto-retrying ingestion ${ingestion.id} (retry ${ingestion.retries + 1}/${ingestion.maxRetries})`,
      );

      // Update retry count and status
      await this.prisma.ingestion.update({
        where: { id: ingestion.id },
        data: {
          status: STATUS.PENDING,
          retries: {
            increment: 1,
          },
          error: null,
        },
      });

      // Process the ingestion
      this.processIngestion(ingestion.id).catch(error => {
        this.logger.error(
          `Error in auto retry: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error instanceof Error ? error.stack : undefined,
        );
      });

      // Add a small delay between retries to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
