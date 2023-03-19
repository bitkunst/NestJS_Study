import { PickType } from '@nestjs/swagger';
import { Comment } from '../schema/comments.schema';

export class CommentCreateDto extends PickType(Comment, ['author', 'contents'] as const) {}
