import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  // instead of declaring the service is where and how
  // simply mention it in auth controller
  // const service = new AuthService()
  // avoid doing it that who manages it and who create it we use dependency injection like in controller

  login() {
    return {
      msg: 'Hello this is signin',
    };
  }

  register() {
    return {
      msg: 'Hello this is signup',
    };
  }
}
