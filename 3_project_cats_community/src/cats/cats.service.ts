import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Cat } from './schema/cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';

@Injectable()
export class CatsService {
    // Schema를 Service 안에서 사용하기 위해서는 의존성 주입이 필요
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

    async signUp(body: CatRequestDto) {
        const { email, name, password } = body;
        const isCatExist = await this.catModel.exists({ email });

        if (isCatExist) {
            throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.'); // 403 에러
            // throw new HttpException('해당하는 고양이는 이미 존재합니다.', 403)
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cat = await this.catModel.create({
            email,
            name,
            password: hashedPassword,
        });

        return cat.readOnlyData;
    }
}
