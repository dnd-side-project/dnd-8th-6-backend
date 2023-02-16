import { DataLogType } from 'src/data-log-type/domain/data-log-type.entity';
import { Member } from 'src/member/domain/member.entity';
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'data_log', default: 0, nullable: false  })
  DataLog!: number;

  @Index()
  @Column({ type: 'date', name: 'log_date', nullable: false })
  LogDate!: Date;

  @ManyToOne(() => Member, (member) => member.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'member_id'})
  MemberId: string;

  @ManyToOne(() => DataLogType, (dataLogType) => dataLogType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'log_type_id'})
  LogTypeId: DataLogType;
}
