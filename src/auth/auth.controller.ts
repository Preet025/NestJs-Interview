import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, VerifyDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Endpoint to login an existing user' })
  @ApiResponse({ status: 201, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration', description: 'Endpoint to register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or user already exists' })
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify account', description: 'Endpoint to verify user using query parameters' })
  @ApiResponse({ status: 200, description: 'Verification successful' })
  @ApiQuery({ name: 'token', required: true, description: 'Verification token sent to user email' })
  verify(@Query() dto: VerifyDto) {
    return this.authService.verify(dto);
  }
}
