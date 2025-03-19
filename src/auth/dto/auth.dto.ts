import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username of the user ' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The phone number of the user', required: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the user and it will be unique' })
  email: string;

  @IsEnum(ROLE)
  @ApiProperty({
    description: 'Role of the user (enum)',
    enum: ROLE,
    example: ROLE.ADMIN,
  })
  role: ROLE;
}
