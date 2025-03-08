import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/User.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Auth)
  private authRepository: Repository<Auth>;

  private authService: AuthService;
  findAll() {
    return this.userRepository.find();
  }

  async register(data: RegisterDto) {
    // 检查是否已经注册
    const userByName = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
      }),
      userByEmail = await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });
    if (userByName) {
      return { message: '用户名已经注册' };
    }
    if (userByEmail) {
      return { message: '邮箱已经注册' };
    }

    // 然后注册
    const auth = new Auth();
    const user = new User();
    user.username = data.username;
    user.email = data.email;
    auth.user = user;
    auth.password = data.password;

    this.authRepository.save(auth);

    return { message: '注册成功' };
  }

  async login(data: LoginDto) {
    // 检查是否已经注册
    const userByName = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });

    if (!userByName) {
      return { message: '用户名不存在' };
    }

    const auth = await this.authRepository.findOne({
      where: {
        user: userByName,
      },
      relations: ['user'],
    });
    if (auth.password !== data.password) {
      return { message: '密码错误' };
    }

    // 然后登录
    return { message: '登录成功' };
  }
}
