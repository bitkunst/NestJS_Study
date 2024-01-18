import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { Socket as SocketModel } from './sockets.model';

const options: SchemaOptions = {
    collection: 'chattings', // 컬렉션 이름 지정 옵션
    timestamps: true, // created_at, updated_at 자동으로 찍어주는 옵션
};

@Schema(options)
export class Chatting extends Document {
    @Prop({
        type: {
            _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
            id: { type: String },
            username: { type: String, required: true },
        },
    })
    @IsNotEmpty()
    user: SocketModel;

    @Prop({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
