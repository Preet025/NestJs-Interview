import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // controller says that jst give me instance of the service in nest js
  /* constructor (){
        const service = new AuthService();
    }*/
  // so how we do it by using dependency injection
  constructor(private authService: AuthService) {}
  @Post('login')
  signin() {
    return this.authService.register();
  }

  @Post('register')
  signup() {
    return this.authService.login();
  }
}
