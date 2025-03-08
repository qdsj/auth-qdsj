import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('/register')
  register(data: RegisterDto) {
    return this.userService.register(data);
  }

  @Post('/login')
  login(data: LoginDto) {
    return this.userService.login(data);
  }
}
