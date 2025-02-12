import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './auth/entities/User.entity';
// import { Auth } from './auth/entities/auth.entity';
console.log(process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: +process.env.DB_PORT,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [User, Auth],
    //   synchronize: true,
    //   poolSize: 5,
    //   logging: false,
    //   connectorPackage: 'mysql2',
    //   extra: {
    //     authPlugins: 'sha256_password',
    //   },
    // }),
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'auth-zenos',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
