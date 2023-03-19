import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import { Cat } from './schema/cats.schema';

// Repository 패턴
// Repository는 의존성 주입이 가능한 클래스
@Injectable()
export class CatsRepository {
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

    async existsByEmail(email: string): Promise<{ _id: any } | null> {
        // class-validator를 사용했기 때문에 에러가 발생한다면 mongoose에서 에러 처리를 해주기는 한다.
        // 에러 처리를 직접적으로 해줄 필요는 없지만 필요하다면 try-catch를 사용해서 해주면 된다.
        try {
            const result = await this.catModel.exists({ email });
            return result;
        } catch (err) {
            throw new HttpException('DB error', 400);
        }
    }

    async create(cat: CatRequestDto): Promise<Cat> {
        return await this.catModel.create(cat);
    }

    async findCatByEmail(email: string): Promise<Cat | null> {
        const cat = await this.catModel.findOne({ email });
        return cat;
    }

    async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
        // const cat = await this.catModel.findById(catId).select('email name'); // email name 필드 선택
        const cat = await this.catModel.findById(catId).select('-password'); // password 필드 제외
        return cat;
    }

    async findByIdAndUpdateImg(id: string, fileName: string) {
        const cat = await this.catModel.findById(id);
        cat.imgUrl = `http://localhost:4000/media/${fileName}`;
        const newCat = await cat.save();
        return newCat.readOnlyData;
    }

    async findAll() {
        return await this.catModel.find();
    }
}
