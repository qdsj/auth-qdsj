import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/auth/entities/User.entity';

const configService = new ConfigService();

export const databaseConfig = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Auth],
  synchronize: true,
  poolSize: 5,
  logging: true,
  connectorPackage: 'mysql2',
  extra: {
    authPlugins: 'sha256_password',
  },
};
