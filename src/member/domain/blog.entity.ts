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

  @Column({
    type: 'enum',
    name: 'platform_type',
    nullable: false,
    enum: PlatformType,
  })
  platformType!: PlatformType;

  @Column({
    type: 'varchar',
    name: 'blog_name',
    nullable: false,
  })
  blogName!: string;

  @OneToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}
