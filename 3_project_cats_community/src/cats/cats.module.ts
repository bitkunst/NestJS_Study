import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { Cat, CatSchema } from './schema/cats.schema';
import { CatsService } from './cats.service';
import { CatsRepository } from './cats.repository';

@Module({
    // CatsService에서 의존성 주입을 통해 Schema를 사용하기 위해서는 CatsModule에서 imports를 해줘야만 한다.
    imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])], // Schema 등록
    controllers: [CatsController],
    providers: [CatsService, CatsRepository], // Repository를 사용하기 위해서 providers에 등록
})
export class CatsModule {}
