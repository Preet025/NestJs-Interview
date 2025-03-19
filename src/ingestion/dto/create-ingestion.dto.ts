import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Source of the ingestion (e.g., file path or system name)',
    example: 'external-system-1',
  })
  source: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Destination of the ingestion (e.g., target service or database)',
    example: 'internal-database',
  })
  destination: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    description: 'Optional metadata as a JSON object containing additional details',
    required: false,
    example: {
      initiatedBy: 'admin_user',
      priority: 'high',
      notes: 'Triggered by scheduler',
    },
  })
  metadata?: Record<string, any>;
}
