import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = this.authService.login(loginDto);

    const token = this.jwtService.sign({ username: user.username });

    console.log(user, token);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 12,
    });

    res.setHeader('token', `${token}`);

    return { user };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern('isLogin')
  isLogin(token: string) {
    console.log(token);
    try {
      const user = this.jwtService.verify(token);
      return {
        isLogin: true,
        user,
      };
    } catch {
      return { isLogin: false, redirect: this.configService.get('LOGIN_PAGE') };
    }
  }

  @MessagePattern('getRedirectUrl')
  getRedirectUrl() {
    console.log(this.configService.get('LOGIN_PAGE'));
    return this.configService.get('LOGIN_PAGE');
  }
}
