import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { ROLE } from '@prisma/client';

describe('DocumentsController', () => {
  let controller: DocumentsController;

  const mockDocumentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = (user: any): Partial<Request> => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user,
  });

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 1234,
    destination: './uploads',
    filename: 'unique_test.txt',
    path: './uploads/unique_test.txt',
    buffer: Buffer.from('test content'),
    stream: {} as any, // not required to test controller behavior
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: DocumentsService, useValue: mockDocumentsService }],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a document', async () => {
    mockDocumentsService.create.mockResolvedValue({ id: 1 });
    const result = await controller.create(mockFile, mockRequest({ id: 1 }) as Request);
    expect(result).toEqual({ id: 1 });
    expect(mockDocumentsService.create).toHaveBeenCalledWith(mockFile, 1);
  });

  it('should throw BadRequestException if no file provided in create', () => {
    expect(() => controller.create(undefined as any, mockRequest({ id: 1 }) as Request)).toThrow(BadRequestException);
  });

  it('should find all documents', async () => {
    mockDocumentsService.findAll.mockResolvedValue([]);
    const result = await controller.findAll(mockRequest({ id: 1, role: ROLE.ADMIN }) as Request);
    expect(result).toEqual([]);
    expect(mockDocumentsService.findAll).toHaveBeenCalledWith({ id: 1, role: ROLE.ADMIN });
  });

  it('should find one document by id', async () => {
    mockDocumentsService.findOne.mockResolvedValue({ id: 1 });
    const result = await controller.findOne(1, mockRequest({ id: 1, role: ROLE.ADMIN }) as Request);
    expect(result).toEqual({ id: 1 });
    expect(mockDocumentsService.findOne).toHaveBeenCalledWith(1, { id: 1, role: ROLE.ADMIN });
  });

  it('should update a document', async () => {
    mockDocumentsService.update.mockResolvedValue({ id: 1 });
    const result = await controller.update(1, mockFile, mockRequest({ id: 1, role: ROLE.EDITOR }) as Request);
    expect(result).toEqual({ id: 1 });
    expect(mockDocumentsService.update).toHaveBeenCalledWith(1, mockFile, { id: 1, role: ROLE.EDITOR });
  });

  it('should remove a document', async () => {
    mockDocumentsService.remove.mockResolvedValue({ id: 1 });
    const result = await controller.remove(1, mockRequest({ id: 1, role: ROLE.ADMIN }) as Request);
    expect(result).toEqual({ id: 1 });
    expect(mockDocumentsService.remove).toHaveBeenCalledWith(1, { id: 1, role: ROLE.ADMIN });
  });
});
