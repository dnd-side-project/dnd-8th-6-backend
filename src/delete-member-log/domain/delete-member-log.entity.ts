import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeleteMemLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'member_id', nullable: false })
  memberId!: number;

  @Column({ type: 'varchar', name: 'reason', length: 512, nullable: false })
  reason!: string;
}
