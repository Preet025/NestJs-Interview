import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(['ADMIN', 'VIEWER', 'EDITOR'])
  role: 'ADMIN' | 'VIEWER' | 'EDITOR';
}
