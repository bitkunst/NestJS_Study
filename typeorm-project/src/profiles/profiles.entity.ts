import { CommonEntity } from '../common/entities/common.entity'; // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from '../users/users.entity';

@Entity({
  name: 'USER_PROFILE',
}) // USER_PROFILE : 테이블 명
export class ProfileEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  site: string;

  //   @OneToOne(() => UserEntity)
  //   user: UserEntity
}
