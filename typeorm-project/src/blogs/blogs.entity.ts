import { CommonEntity } from '../common/entities/common.entity'; // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { TagEntity } from '../tags/tags.entity';
import { VisitorEntity } from '../visitors/visitors.entity';

@Entity({
  name: 'BLOG',
}) // BLOG : 테이블 명
export class BlogEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false }) // @Column() 데코레이터를 통해 DB에 저장될 때의 속성 기입
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  contents: string;

  //* Relation */

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.blogs, {
    onDelete: 'CASCADE', // 사용자가 삭제되면 블로그도 삭제된다. (삭제 관련해서만 CASCADE 옵션을 준 것)
  })
  @JoinColumn([
    // ManyToOne에서 Many에 해당하는 쪽에 @JoinColumn() 추가
    // foreignkey 정보들
    {
      name: 'author_id', // DB에 저장되는 필드 이름
      referencedColumnName: 'id', // USER의 id
    },
  ])
  author: UserEntity;

  /**
   * * ManyToMany는 물리적으로 DB 상에 하나의 테이블이 더 필요하다. (중간 매개 테이블)
   * * 튜플 방식으로 묶을 필요가 있다. (튜플 자료구조)
   */

  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.blogs, {
    cascade: true, // 블로그를 통해 태그가 추가, 수정, 삭제되고 블로그를 저장하면 태그도 저장된다.
  })
  @JoinTable({
    // table을 만들어준다. (중간 매개 테이블)
    name: 'BLOG_TAG',
    joinColumn: {
      name: 'blog_id',
      referencedColumnName: 'id', // blog 자기 자신에 대한 id
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id', // tag에 대한 id
    },
  })
  tags: TagEntity[];

  @OneToMany(() => VisitorEntity, (visitor: VisitorEntity) => visitor.blog, {
    cascade: true,
  })
  visitors: VisitorEntity[];
}

/*
const author = await User.findOne( { id: '...' } )
author.blogs.push(new BlogEntity(...))
await author.save()
*/
