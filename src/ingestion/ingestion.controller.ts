import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto';
import { Request } from 'express';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  triggerIngestion(@Body() createIngestionDto: CreateIngestionDto, @Req() req: Request) {
    return this.ingestionService.triggerIngestion(createIngestionDto, req.user.id);
  }

  @Get()
  getAllIngestions(@Req() req: Request) {
    return this.ingestionService.getAllIngestions(req.user.id);
  }

  @Get(':id')
  getIngestionStatus(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ingestionService.getIngestionStatus(id, req.user.id);
  }

  @Post(':id/retry')
  retryIngestion(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ingestionService.retryIngestion(id, req.user.id);
  }

  // Admin only endpoint to view all ingestions regardless of user
  @Get('admin/all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getAllIngestionsAdmin(@Req() req: Request) {
    return this.ingestionService.getAllIngestions(req.user.id);
  }
}
