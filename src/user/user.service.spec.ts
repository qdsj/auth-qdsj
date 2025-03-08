import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/User.entity';
import { Auth } from '../auth/entities/auth.entity';
import { RegisterDto } from './dto/register.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: any;
  let authRepositoryMock: any;

  beforeEach(async () => {
    // 创建模拟的仓库
    userRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    authRepositoryMock = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: authRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('应该返回用户名已经注册的消息，当用户名已存在时', async () => {
      // 准备测试数据
      const registerDto: RegisterDto = {
        username: 'existingUser',
        email: 'test@example.com',
        password: 'password123',
      };

      // 模拟 userRepository.findOne 返回用户
      userRepositoryMock.findOne.mockImplementation((options) => {
        if (options.where.username === 'existingUser') {
          return { id: 1, username: 'existingUser' };
        }
        return null;
      });

      // 执行测试
      const result = await service.register(registerDto);

      // 验证结果
      expect(result).toEqual({ message: '用户名已经注册' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'existingUser' },
      });
      expect(authRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('应该返回邮箱已经注册的消息，当邮箱已存在时', async () => {
      // 准备测试数据
      const registerDto: RegisterDto = {
        username: 'newUser',
        email: 'existing@example.com',
        password: 'password123',
      };

      // 模拟 userRepository.findOne 返回结果
      userRepositoryMock.findOne.mockImplementation((options) => {
        if (options.where.username === 'newUser') {
          return null;
        }
        if (options.where.email === 'existing@example.com') {
          return { id: 2, email: 'existing@example.com' };
        }
        return null;
      });

      // 执行测试
      const result = await service.register(registerDto);

      // 验证结果
      expect(result).toEqual({ message: '邮箱已经注册' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'newUser' },
      });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
      expect(authRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('应该成功注册用户并返回成功消息，当用户名和邮箱都不存在时', async () => {
      // 准备测试数据
      const registerDto: RegisterDto = {
        username: 'newUser',
        email: 'new@example.com',
        password: 'password123',
      };

      // 模拟 userRepository.findOne 返回 null（用户不存在）
      userRepositoryMock.findOne.mockReturnValue(null);

      // 模拟 authRepository.save
      authRepositoryMock.save.mockImplementation((auth) => {
        return Promise.resolve({ ...auth, id: 1 });
      });

      // 执行测试
      const result = await service.register(registerDto);

      // 验证结果
      expect(result).toEqual({ message: '注册成功' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(authRepositoryMock.save).toHaveBeenCalledTimes(1);

      // 验证 save 方法被调用时的参数
      const saveArg = authRepositoryMock.save.mock.calls[0][0];
      expect(saveArg).toBeInstanceOf(Auth);
      expect(saveArg.user).toBeInstanceOf(User);
      expect(saveArg.user.username).toBe('newUser');
      expect(saveArg.user.email).toBe('new@example.com');
      expect(saveArg.password).toBe('password123');
    });
  });
});
