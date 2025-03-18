import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE } from '@prisma/client';
import { Readable } from 'stream';

describe('DocumentsService', () => {
  let service: DocumentsService;

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
    stream: new Readable(), // added stream property
  };

  const mockPrisma = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should create a document', async () => {
    mockPrisma.document.create.mockResolvedValue({ id: 1, fileName: 'unique_test.txt' });
    const result = await service.create(mockFile, 1);
    expect(result).toHaveProperty('id');
  });

  it('should throw ForbiddenException if no file is provided', async () => {
    await expect(service.create(undefined as any, 1)).rejects.toThrow(ForbiddenException);
  });

  it('should find all documents for ADMIN', async () => {
    mockPrisma.document.findMany.mockResolvedValue([]);
    const result = await service.findAll({ id: 1, role: ROLE.ADMIN });
    expect(result).toEqual([]);
  });

  it('should find all documents for non-admin (VIEWER)', async () => {
    mockPrisma.document.findMany.mockResolvedValue([]);
    const result = await service.findAll({ id: 2, role: ROLE.VIEWER });
    expect(result).toEqual([]);
  });

  it('should find one document for ADMIN', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 2 });
    const result = await service.findOne(1, { id: 1, role: ROLE.ADMIN });
    expect(result).toHaveProperty('id');
  });

  it('should throw ForbiddenException for unauthorized user in findOne', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 2 });
    await expect(service.findOne(1, { id: 1, role: ROLE.VIEWER })).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if document not found in findOne', async () => {
    mockPrisma.document.findUnique.mockResolvedValue(null);
    await expect(service.findOne(1, { id: 1, role: ROLE.ADMIN })).rejects.toThrow(NotFoundException);
  });

  it('should update document for ADMIN', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 1, filePath: './old' });
    mockPrisma.document.update.mockResolvedValue({ id: 1, fileName: 'new.txt' });
    const result = await service.update(1, mockFile, { id: 1, role: ROLE.ADMIN });
    expect(result).toHaveProperty('id');
  });

  it('should throw ForbiddenException if unauthorized update attempt', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 2, filePath: './old' });
    await expect(service.update(1, mockFile, { id: 1, role: ROLE.VIEWER })).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if document not found on update', async () => {
    mockPrisma.document.findUnique.mockResolvedValue(null);
    await expect(service.update(1, mockFile, { id: 1, role: ROLE.ADMIN })).rejects.toThrow(NotFoundException);
  });

  it('should delete document for ADMIN', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 1, filePath: './old' });
    mockPrisma.document.delete.mockResolvedValue({ id: 1 });
    const result = await service.remove(1, { id: 1, role: ROLE.ADMIN });
    expect(result).toHaveProperty('id');
  });

  it('should throw ForbiddenException if unauthorized delete attempt', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 1, userId: 2, filePath: './old' });
    await expect(service.remove(1, { id: 1, role: ROLE.VIEWER })).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if document not found on delete', async () => {
    mockPrisma.document.findUnique.mockResolvedValue(null);
    await expect(service.remove(1, { id: 1, role: ROLE.ADMIN })).rejects.toThrow(NotFoundException);
  });
});
