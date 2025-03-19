import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'email for login and it is unique' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Example: minimum password length
  @ApiProperty({ description: 'The password for user account' })
  password: string;
}
