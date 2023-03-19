import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { Comment } from 'src/comments/schema/comments.schema';

// 스키마 옵션
const options: SchemaOptions = {
    collection: 'cats', // collection 이름 지정 (생략 가능)
    timestamps: true,
};
// collection 옵션 생략시, [소문자로 변경된 클래스명] + 's' 붙여서 collection 이름을 자동으로 만들어준다.

// @Schema() 데코레이터을 사용해서 스키마 정의
@Schema(options)
export class Cat extends Document {
    // dto에서 Cat 클래스를 상속받아 사용하기 위해 @ApiProperty 데코레이터 추가
    @ApiProperty({
        example: 'russian.blue@gmail.com',
        description: 'email',
        required: true,
    })
    @Prop({
        required: true,
        unique: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'ruble',
        description: 'name',
        required: true,
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '12345',
        description: 'password',
        required: true,
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @Prop({
        default: 'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg',
    })
    @IsString()
    imgUrl: string;

    readonly readOnlyData: { id: string; email: string; name: string; imgUrl: string; comments: Comment[] };

    readonly commentsData: Comment[];
}

// Cat 클래스를 스키마로 만들어준다.
const _CatSchema = SchemaFactory.createForClass(Cat);

// virtual field
// 실제로 DB에 저장되는 필드는 아니지만, 비즈니스 로직에서 사용할 수 있도록 제공해주는 필드
// readOnlyData => 클라이언트에게 보여줄 데이터만 virtual로 필터링해서 나간다.
_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
    return {
        id: this.id,
        email: this.email,
        name: this.name,
        imgUrl: this.imgUrl,
        comments: this.commentsData,
    };
});

//* virtual 필드를 만듦으로써 다른 document와 연결을 할 수 있다.
_CatSchema.virtual('commentsData', {
    ref: 'comments', // 해당 스키마 이름
    localField: '_id',
    foreignField: 'info', // comments에서 info를 기준으로 가져오겠다.
});

// populate() : 다른 document와 이어줄 수 있는 메소드
// populate 옵션 설정
_CatSchema.set('toObject', { virtuals: true });
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;
