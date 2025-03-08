import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);
    const token = this.jwtService.sign({ username: user.username });
    console.log(user, token);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 12,
    });

    return { user };
  }

  @Get()
  auth() {
    return { message: '/auth' };
  }
  @MessagePattern('isLogin')
  isLogin(token: string) {
    console.log(token);
    try {
      const user = this.jwtService.verify(token);
      return { isLogin: true, user };
    } catch {
      return { isLogin: false };
    }
  }
}
