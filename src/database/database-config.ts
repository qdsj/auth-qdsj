import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/auth/entities/User.entity';

export const getDataBaseConfig = (configService: ConfigService) => {
  console.log(configService.get('DB_HOST'));
  console.log(configService.get('DB_PORT'));
  console.log(configService.get('DB_USERNAME'));
  console.log(configService.get('DB_PASSWORD'));
  console.log(configService.get('DB_DATABASE'));

  return {
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
};
