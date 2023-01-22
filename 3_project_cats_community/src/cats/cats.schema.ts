import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
    timestamps: true,
};

@Schema(options)
export class Cat extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

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
