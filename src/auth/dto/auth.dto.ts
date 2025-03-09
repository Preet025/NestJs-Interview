import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  //   @IsInt()
  //   id: number;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  email: string;
}
