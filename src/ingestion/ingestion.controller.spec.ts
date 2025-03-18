import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
    getAllIngestions: jest.fn(),
    getIngestionStatus: jest.fn(),
    retryIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockIngestionService }],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should trigger ingestion', async () => {
    const dto: CreateIngestionDto = { source: 'src', destination: 'dest' };
    const req = { user: { id: 1 } };
    mockIngestionService.triggerIngestion.mockResolvedValue({ id: 1 });

    const result = await controller.triggerIngestion(dto, req as any);
    expect(result).toEqual({ id: 1 });
    expect(service.triggerIngestion).toHaveBeenCalledWith(dto, 1);
  });

  it('should get all ingestions', async () => {
    const req = { user: { id: 1 } };
    mockIngestionService.getAllIngestions.mockResolvedValue([{ id: 1 }]);

    const result = await controller.getAllIngestions(req as any);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should get ingestion status by ID', async () => {
    const req = { user: { id: 1 } };
    mockIngestionService.getIngestionStatus.mockResolvedValue({ id: 1 });

    const result = await controller.getIngestionStatus(1, req as any);
    expect(result).toEqual({ id: 1 });
  });

  it('should retry ingestion', async () => {
    const req = { user: { id: 1 } };
    mockIngestionService.retryIngestion.mockResolvedValue({ id: 1 });

    const result = await controller.retryIngestion(1, req as any);
    expect(result).toEqual({ id: 1 });
  });

  it('should get all ingestions for admin', async () => {
    const req = { user: { id: 1 } };
    mockIngestionService.getAllIngestions.mockResolvedValue([{ id: 1 }]);

    const result = await controller.getAllIngestionsAdmin(req as any);
    expect(result).toEqual([{ id: 1 }]);
  });
});
