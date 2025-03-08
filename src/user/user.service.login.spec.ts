import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/User.entity';
import { Auth } from '../auth/entities/auth.entity';
import { LoginDto } from './dto/login.dto';

describe('UserService - login', () => {
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
      findOne: jest.fn(),
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

  describe('login', () => {
    it('应该返回用户名不存在的消息，当用户名不存在时', async () => {
      // 准备测试数据
      const loginDto: LoginDto = {
        username: 'nonexistentUser',
        password: 'password123',
      };

      // 模拟 userRepository.findOne 返回 null（用户不存在）
      userRepositoryMock.findOne.mockResolvedValue(null);

      // 执行测试
      const result = await service.login(loginDto);

      // 验证结果
      expect(result).toEqual({ message: '用户名不存在' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistentUser' },
      });
      expect(authRepositoryMock.findOne).not.toHaveBeenCalled();
    });

    it('应该返回密码错误的消息，当密码不匹配时', async () => {
      // 准备测试数据
      const loginDto: LoginDto = {
        username: 'existingUser',
        password: 'wrongPassword',
      };

      const mockUser = { id: 1, username: 'existingUser' };

      // 模拟 userRepository.findOne 返回用户
      userRepositoryMock.findOne.mockResolvedValue(mockUser);

      // 模拟 authRepository.findOne 返回认证信息
      authRepositoryMock.findOne.mockResolvedValue({
        id: 1,
        user: mockUser,
        password: 'correctPassword',
      });

      // 执行测试
      const result = await service.login(loginDto);

      // 验证结果
      expect(result).toEqual({ message: '密码错误' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'existingUser' },
      });
      expect(authRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user: mockUser },
        relations: ['user'],
      });
    });

    it('应该返回登录成功的消息，当用户名和密码都正确时', async () => {
      // 准备测试数据
      const loginDto: LoginDto = {
        username: 'existingUser',
        password: 'correctPassword',
      };

      const mockUser = { id: 1, username: 'existingUser' };

      // 模拟 userRepository.findOne 返回用户
      userRepositoryMock.findOne.mockResolvedValue(mockUser);

      // 模拟 authRepository.findOne 返回认证信息
      authRepositoryMock.findOne.mockResolvedValue({
        id: 1,
        user: mockUser,
        password: 'correctPassword',
      });

      // 执行测试
      const result = await service.login(loginDto);

      // 验证结果
      expect(result).toEqual({ message: '登录成功' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'existingUser' },
      });
      expect(authRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { user: mockUser },
        relations: ['user'],
      });
    });
  });
});
