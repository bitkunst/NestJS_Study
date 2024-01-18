import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
    id: false, // 오브젝트 아이디(유니크 키) 생성 X , default true
    collection: 'sockets', // 컬렉션 이름 지정 옵션
    timestamps: true, // created_at, updated_at 자동으로 찍어주는 옵션
};

@Schema(options)
export class Socket extends Document {
    @Prop({
        unique: true,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @Prop({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    username: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);
