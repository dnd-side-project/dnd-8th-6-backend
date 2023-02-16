import { LogData } from 'src/log-data/domain/log-data.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LogType } from './log-type.enum';

@Entity()
export class DataLogType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', name: 'log_type', nullable: false, enum: LogType })
  logType!: LogType;

  @OneToMany(() => LogData, (logData) => logData.LogTypeId)
  logData!: LogData;
}
