import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

// 스키마 옵션
const options: SchemaOptions = {
    timestamps: true,
};

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

    @Prop()
    @IsString()
    imgUrl: string;

    readonly readOnlyData: { id: string; email: string; name: string };
}

// Cat 클래스를 스키마로 만들어준다.
export const CatSchema = SchemaFactory.createForClass(Cat);

// virtual field
// 실제로 DB에 저장되는 필드는 아니지만, 비즈니스 로직에서 사용할 수 있도록 제공해주는 필드
// readOnlyData => 클라이언트에게 보여줄 데이터만 virtual로 필터링해서 나간다.
CatSchema.virtual('readOnlyData').get(function (this: Cat) {
    return {
        id: this.id,
        email: this.email,
        name: this.name,
    };
});
