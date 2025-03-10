import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIngestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  source: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  destination: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
