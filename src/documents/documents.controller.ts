import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth() // Tells Swagger these endpoints need auth header
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a new document (Admin or Editor only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file || !file.originalname) {
      throw new BadRequestException('Valid file is required');
    }
    return this.documentsService.create(file, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for the logged-in user' })
  findAll(@Req() req: Request) {
    return this.documentsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details by ID for logged-in user' })
  @ApiParam({ name: 'id', type: Number, description: 'Document ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update an existing document (Admin or Editor only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Document ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New file to update (optional)',
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.documentsService.update(id, file, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a document (Admin or Editor only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Document ID' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.remove(id, req.user);
  }
}
