import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from 'src/auth/entities/User.entity';

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
    return this.userService.findOneByNameOrEmail(username, email);
  }

  @MessagePattern('findUserById')
  findUserById(id: string) {
    if (!id) return null;
    return this.userService.findUserById(id);
  }

  @MessagePattern('updateUserInfo')
  async updateUserInfo(data: User) {
    try {
      await this.userService.updateUserInfo(data);
      return {
        status: 'success',
        message: '更新成功',
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error,
      };
    }
  }
}
