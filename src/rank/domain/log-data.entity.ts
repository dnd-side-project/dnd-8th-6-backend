import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Member } from '../../member/domain/member.entity';
import { DataLogType } from './log-type.entity';

@Entity()
export class LogData extends BaseEntity {
  @PrimaryColumn({ type: 'date', name: 'log_date' })
  logDate!: Date;

  @PrimaryColumn({ name: 'member_id' })
  memberId: string;

  @PrimaryColumn({ name: 'log_type_id' })
  logTypeId: number;

  @Column({ type: 'int', name: 'data_log', default: 0, nullable: false })
  dataLog!: number;

  @ManyToOne(() => Member, (member) => member.logData, {
    nullable: false,
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => DataLogType, (dataLogType) => dataLogType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'log_type_id' })
  logType: DataLogType;
}
