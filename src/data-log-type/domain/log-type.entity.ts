import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LogType } from './log-type.enum';
import { LogData } from '../../log-data/domain/log-data.entity';

@Entity()
export class DataLogType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', name: 'log_type', nullable: false, enum: LogType })
  logType!: LogType;

  @OneToMany(() => LogData, (logData) => logData.LogTypeId)
  logData!: LogData;
}
