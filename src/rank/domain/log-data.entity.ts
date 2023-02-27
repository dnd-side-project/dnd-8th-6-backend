import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/domain/member.entity';
import { DataLogType } from './log-type.entity';

@Entity()
export class LogData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'data_log', default: 0, nullable: false })
  dataLog!: number;

  @Index()
  @Column({ type: 'date', name: 'log_date', nullable: false })
  logDate!: Date;

  @ManyToOne(() => Member, (member) => member.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'member_id' })
  memberId: string;

  @ManyToOne(() => DataLogType, (dataLogType) => dataLogType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'log_type_id' })
  logTypeId: DataLogType;
}
