import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getUniqueFileName, saveFile, deleteFile } from '../utils/file.utils';
import { ROLE } from '@prisma/client';

interface User {
  id: number;
  role: ROLE;
}

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new ForbiddenException('No file uploaded');
    }

    const uniqueFileName = getUniqueFileName(file.originalname);
    const filePath = saveFile(file, uniqueFileName);

    const document = await this.prisma.document.create({
      data: {
        fileName: uniqueFileName,
        filePath: filePath,
        fileType: file.mimetype,
        fileSize: file.size,
        userId,
      },
    });

    return document;
  }

  // async findAll(user: any) {
  async findAll(user: User) {
    // ADMIN can see all documents, others can only see their own
    if (user.role === 'ADMIN') {
      return this.prisma.document.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      });
    }

    return this.prisma.document.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // async findOne(id: number, user: any) {
  async findOne(id: number, user: User) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Check if user has permission to access this document
    if (user.role !== 'ADMIN' && document.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to access this document');
    }

    return document;
  }

  // async update(id: number, file: Express.Multer.File, user: User) {
  async update(id: number, file: Express.Multer.File, user: User) {
    // Find the existing document
    const existingDoc = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existingDoc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Check if user has permission to update this document
    if (user.role !== 'ADMIN' && existingDoc.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to update this document');
    }

    // If a new file is provided, update the file
    if (file) {
      // Delete the old file
      deleteFile(existingDoc.filePath);

      // Save the new file
      const uniqueFileName = getUniqueFileName(file.originalname);
      const filePath = saveFile(file, uniqueFileName);

      // Update document in database
      return this.prisma.document.update({
        where: { id },
        data: {
          fileName: uniqueFileName,
          filePath: filePath,
          fileType: file.mimetype,
          fileSize: file.size,
        },
      });
    }

    // If no new file, just return the existing document
    return existingDoc;
  }

  // async remove(id: number, user: any) {
  async remove(id: number, user: User) {
    // Find the document to ensure it exists
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Check if user has permission to delete this document
    if (user.role !== 'ADMIN' && document.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this document');
    }

    // Delete the file from the filesystem
    deleteFile(document.filePath);

    // Delete from database
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
