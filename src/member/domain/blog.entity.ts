import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlatformType } from './platform-type.enum';
import { Member } from './member.entity';

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'article_cnt', default: 0 })
  articleCnt!: number;

  // @Column({ type: 'int', name: 'visitor_cnt', default: 0 })
  // visitorCnt!: number;

  @Column({
    type: 'enum',
    name: 'platform_type',
    nullable: false,
    enum: PlatformType,
  })
  platformType!: PlatformType;

  @OneToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}
