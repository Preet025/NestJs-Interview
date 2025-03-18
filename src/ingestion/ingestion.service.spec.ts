import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockApiService } from './mock-api.service';
import { STATUS, ROLE } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('IngestionService', () => {
  let service: IngestionService;
  let prisma: PrismaService;
  let mockApiService: MockApiService;

  const mockPrisma = {
    ingestion: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockMockApiService = {
    processIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MockApiService, useValue: mockMockApiService },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    prisma = module.get<PrismaService>(PrismaService);
    mockApiService = module.get<MockApiService>(MockApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger ingestion', async () => {
    mockPrisma.ingestion.create.mockResolvedValue({ id: 1 });
    const dto = { source: 'src', destination: 'dest', metadata: {} };

    const result = await service.triggerIngestion(dto, 1);

    expect(result).toEqual({ id: 1 });
    expect(mockPrisma.ingestion.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException if ingestion not found in getIngestionStatus', async () => {
    mockPrisma.ingestion.findUnique.mockResolvedValue(null);
    await expect(service.getIngestionStatus(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user not authorized for ingestion', async () => {
    mockPrisma.ingestion.findUnique.mockResolvedValue({ id: 1, userId: 2 });
    mockPrisma.user.findUnique.mockResolvedValue({ role: ROLE.VIEWER });

    await expect(service.getIngestionStatus(1, 1)).rejects.toThrow(ForbiddenException);
  });

  it('should return all ingestions for admin', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ role: ROLE.ADMIN });
    mockPrisma.ingestion.findMany.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAllIngestions(1);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should retry failed ingestion', async () => {
    mockPrisma.ingestion.findUnique.mockResolvedValue({ id: 1, status: STATUS.FAILED, userId: 1 });
    mockPrisma.user.findUnique.mockResolvedValue({ role: ROLE.ADMIN });
    mockPrisma.ingestion.update.mockResolvedValue({ id: 1 });

    const result = await service.retryIngestion(1, 1);
    expect(result).toEqual({ id: 1 });
  });
});
