import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'email for login and it is unique' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The password for user account' })
  token?: string;
}
