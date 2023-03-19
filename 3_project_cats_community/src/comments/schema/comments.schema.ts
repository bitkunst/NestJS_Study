import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

// 스키마 옵션
const options: SchemaOptions = {
    collection: 'comments',
    timestamps: true,
};

// @Schema() 데코레이터을 사용해서 스키마 정의
@Schema(options)
export class Comment extends Document {
    @ApiProperty({
        description: '작성한 고양이 id',
        required: true,
    })
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'cats', // 어떤 document랑 연결할 것인지 적어준다. (colleciton 명을 적어준다.)
    })
    @IsNotEmpty()
    author: Types.ObjectId; // 사용자에게 보여줄 때는 MongoDB가 자동으로 string으로 변환해준다. 하지만 DB에서 핸들링 할 때는 Types.ObjectId 타입이다.

    @ApiProperty({
        description: '댓글 컨텐츠',
        required: true,
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    contents: string;

    @ApiProperty({
        description: '좋아요 수',
    })
    @Prop({
        default: 0,
    })
    @IsPositive()
    likesCount: number;

    @ApiProperty({
        description: '작성 대상 (게시물, 정보글)',
        required: true,
    })
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'cats', // 어떤 document랑 연결할 것인지 적어준다. (colleciton 명을 적어준다.)
    })
    @IsNotEmpty()
    info: Types.ObjectId;
}

// Comment 클래스를 스키마로 만들어준다.
export const CommentSchema = SchemaFactory.createForClass(Comment);
