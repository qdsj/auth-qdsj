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
    return this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }
}
