import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LogType } from './log-type.enum';

@Entity()
export class DataLogType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', name: 'log_type', nullable: false, enum: LogType })
  LogType!: LogType;
}
