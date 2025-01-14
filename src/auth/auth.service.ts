import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

const users = [
  {
    username: 'admin',
    password: '123456',
  },
];

@Injectable()
export class AuthService {
  register(createAuthDto: CreateAuthDto) {
    const user = users.find((user) => user.username === createAuthDto.username);
    if (user) {
      throw new BadRequestException('用户已存在');
    }
    users.push(createAuthDto);
    return { username: createAuthDto.username, message: '注册成功' };
  }

  login(loginDto: LoginAuthDto) {
    const user = users.find((user) => user.username === loginDto.username);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== loginDto.password) {
      throw new BadRequestException('密码错误');
    }
    return { username: user.username, message: '登录成功' };
  }

  findAll() {
    return users;
  }

  findOne(username: string) {
    return users.find((user) => user.username === username);
  }
}
