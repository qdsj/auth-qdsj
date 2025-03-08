import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Auth)
  private authRepository: Repository<Auth>;
  async register(data: RegisterDto) {
    if (!data || !data.username || !data.email || !data.password)
      throw new BadRequestException('缺少参数');
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
      throw new BadRequestException('用户名已经注册');
    }
    if (userByEmail) {
      throw new BadRequestException('邮箱已经注册');
    }

    // 然后注册
    const auth = new Auth();
    const user = new User();
    user.username = data.username;
    user.email = data.email;
    auth.user = user;
    auth.password = data.password;

    await this.authRepository.save(auth);

    return { user, message: '注册成功' };
  }

  async login(data: LoginDto) {
    // 检查是否已经注册
    const userByName = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });

    if (!userByName) {
      throw new BadRequestException('用户不存在');
    }

    const auth = await this.authRepository.findOne({
      where: {
        user: userByName,
      },
      relations: ['user'],
    });
    if (auth.password !== data.password) {
      throw new BadRequestException('密码错误');
    }

    // 然后登录
    return { username: data.username, message: '登录成功' };
  }
}
