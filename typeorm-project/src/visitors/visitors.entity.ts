import { CommonEntity } from '../common/entities/common.entity'; // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsIP, IsNotEmpty } from 'class-validator';
import { BlogEntity } from '../blogs/blogs.entity';

@Entity({
  name: 'VISITOR',
}) // TAG : 테이블 명
export class VisitorEntity extends CommonEntity {
  @IsIP()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  ip: string;

  //* Relation */

  @ManyToOne(() => BlogEntity, (blog: BlogEntity) => blog.visitors, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'blog_id', referencedColumnName: 'id' }])
  blog: BlogEntity;
}
