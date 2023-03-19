import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from 'src/cats/cats.module';
import { CommentsController } from './controllers/comments.controller';
import { Comment, CommentSchema } from './schema/comments.schema';
import { CommentsService } from './services/comments.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), CatsModule],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}
