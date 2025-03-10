import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, VerifyDto } from './dto';
import { LoginDto } from './dto/login.dto';
// import {ParseIntPipe} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // controller says that jst give me instance of the service in nest js
  /* constructor (){
        const service = new AuthService();
    }*/
  // so how we do it by using dependency injection
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
  // @Post('register')
  // signup(@Body('username') username: string, @Body('password', ParseIntPipe) password: string) {
  //   //       ParseIntPipe = it will put validation on the body if any column is number then it will convert that in number, because in the url /signup/user/1, ----> this id 1 will be considered as the string so it will convert it into number
  //   console.log({
  //     username,
  //     typeOfUsername: typeof username,
  //     password,
  //     typeOfPassword: typeof password,
  //   });
  //   return this.authService.register();
  // }

  @Get('verify')
  verify(@Query() dto: VerifyDto) {
    return this.authService.verify(dto);
  }
}
