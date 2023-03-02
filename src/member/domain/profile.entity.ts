import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description!: string;

  @OneToOne(() => Member, (member) => member.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}
