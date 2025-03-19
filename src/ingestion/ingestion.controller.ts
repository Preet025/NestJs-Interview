import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto';
import { Request } from 'express';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Ingestion')
@ApiBearerAuth() // This will add bearer auth globally to these endpoints in Swagger
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @ApiOperation({ summary: 'Trigger a new ingestion process' })
  @ApiResponse({ status: 201, description: 'Ingestion triggered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request or Validation Error' })
  triggerIngestion(@Body() createIngestionDto: CreateIngestionDto, @Req() req: Request) {
    return this.ingestionService.triggerIngestion(createIngestionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ingestion records for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of ingestions' })
  getAllIngestions(@Req() req: Request) {
    return this.ingestionService.getAllIngestions(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ingestion status by ingestion ID' })
  @ApiResponse({ status: 200, description: 'Ingestion status fetched successfully' })
  @ApiResponse({ status: 404, description: 'Ingestion not found' })
  getIngestionStatus(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ingestionService.getIngestionStatus(id, req.user.id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry ingestion for a given ingestion ID' })
  @ApiResponse({ status: 200, description: 'Ingestion retry triggered' })
  @ApiResponse({ status: 404, description: 'Ingestion not found' })
  retryIngestion(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ingestionService.retryIngestion(id, req.user.id);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Admin-only endpoint to get all ingestions' })
  @ApiResponse({ status: 200, description: 'List of all ingestions (admin)' })
  getAllIngestionsAdmin(@Req() req: Request) {
    return this.ingestionService.getAllIngestions(req.user.id);
  }
}
