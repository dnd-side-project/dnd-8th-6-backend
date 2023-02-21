import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaformType } from './plaform-type.enum';
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
    name: 'plaform_type',
    nullable: false,
    enum: PlaformType,
  })
  plaformType!: PlaformType;

  @OneToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}
