import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  private authService: AuthService;
  findAll() {
    return this.userRepository.find();
  }

  findOneByNameOrEmail(username: string, email: string) {
    if (!username && !email) return null;
    const whereArr = [];
    if (username) {
      whereArr.push({ username });
    }
    if (email) {
      whereArr.push({ email });
    }
    return this.userRepository.findOne({
      where: whereArr,
    });
  }

  findUserById(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateUserInfo(data: User) {
    // 查找是否此人
    const user = await this.userRepository.findOneBy({ id: data.id });
    if (!user) throw new Error('用户不存在');
    // 不允许修改user name, user email
    if (data.username || data.email) {
      throw new Error('不允许修改username、 email');
    }

    return this.userRepository.update(data.id, {
      ...user,
      sex: data.sex || user.sex || 'male',
      description: data.description || user.description || '',
      avatar: data.avatar || user.avatar || '',
    });
  }
}
