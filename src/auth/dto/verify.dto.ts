import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  token?: string;
}
