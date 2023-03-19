import { forwardRef, Module } from '@nestjs/common';
//* forwardRef : 순환 모듈 참조 문제 해결을 위한 방법
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats.controller';
import { Cat, CatSchema } from './schema/cats.schema';
import { CatsService } from './services/cats.service';
import { CatsRepository } from './cats.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { Comment, CommentSchema } from 'src/comments/schema/comments.schema';

@Module({
    // CatsService에서 의존성 주입을 통해 Schema를 사용하기 위해서는 CatsModule에서 imports를 해줘야만 한다.
    // MongooseModule.forFeature() -> Schema 등록
    imports: [
        MongooseModule.forFeature([
            { name: Cat.name, schema: CatSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        forwardRef(() => AuthModule),
        MulterModule.register({
            dest: './upload',
        }),
    ],
    controllers: [CatsController],
    providers: [CatsService, CatsRepository], // Repository를 사용하기 위해서 providers에 등록
    exports: [CatsRepository],
})
export class CatsModule {}
