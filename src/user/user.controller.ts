import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('findUserByNameOrEmail')
  findUserByNameOrEmail(params: { username: string; email: string }) {
    const username = params?.username;
    const email = params?.email;
    console.log(username, email);
    return this.userService.findOneByNameOrEmail(username, email);
  }

  @MessagePattern('findUserById')
  findUserById(id: string) {
    if (!id) return null;
    return this.userService.findUserById(id);
  }
}
