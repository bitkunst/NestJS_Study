import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatsRepository } from 'src/cats/cats.repository';
import { CommentCreateDto } from '../dto/comments.create.dto';
import { Comment } from '../schema/comments.schema';

@Injectable()
export class CommentsService {
    constructor(
        private readonly catsRepository: CatsRepository,
        @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    ) {}

    async getAllComments() {
        try {
            const comments = await this.commentModel.find();
            return comments;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createComment(id: string, commentData: CommentCreateDto) {
        try {
            const targetCat = await this.catsRepository.findCatByIdWithoutPassword(id);
            const { author, contents } = commentData;
            const validatedAuthor = await this.catsRepository.findCatByIdWithoutPassword(author);

            const newComment = new this.commentModel({
                author: validatedAuthor._id,
                contents,
                info: targetCat._id,
            });

            return await newComment.save();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async plusLike(id: string) {
        try {
            const comment = await this.commentModel.findById(id);
            comment.likesCount += 1;
            return await comment.save();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
