import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { TagsModule } from './tags/tags.module';
import { VisitorsModule } from './visitors/visitors.module';
import { ProfilesModule } from './profiles/profiles.module';
import * as Joi from 'joi';
import { AppDataSource } from 'ormconfig';

// const typeOrmModuleOptions = {
//   useFactory: async (
//     configService: ConfigService,
//   ): Promise<TypeOrmModuleOptions> => ({
//     namingStrategy: new SnakeNamingStrategy(),
//     type: 'mysql',
//     host: configService.get('DB_HOST'),
//     port: configService.get('DB_PORT'),
//     username: configService.get('DB_USER'),
//     password: configService.get('DB_PASSWORD'),
//     database: configService.get('DB_NAME'),
//     entities: [],
//     synchronize: true, //! 동기화 (개발 단계에서만 true) , set 'false' in production (production 모드에서는 false로 한 후 migration 진행)
//     autoLoadEntities: true, // * 자동으로 entity 로드
//     logging: true, //! 개발 환경에서만 true 권장
//   }),
//   inject: [ConfigService],
// };
/**
 * * useFactory : 함수에 대해서 모듈 설정을 해준다.
 * * inject : 의존성 주입 (useFactory에서 사용하기 위해)
 */

// ConfigModule에서 validationSchema : 환경변수에 대한 유효성 검사 시행 => 'joi' 패키지 사용
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'development', 'prod', 'production', 'test')
          .default('development'),
        ADMIN_USER: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306).required(),
        DB_DATABASE: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }), // ConfigModule을 전역 모듈로 설정 (모든 모듈에서 configService 사용 가능)
    // TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    TypeOrmModule.forRoot(AppDataSource.options as TypeOrmModuleOptions),
    UsersModule,
    BlogsModule,
    TagsModule,
    VisitorsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
