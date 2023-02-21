import { Member } from 'src/member/domain/member.entity';
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description!: string;

  @OneToOne(() => Member, (member) => member.id, { onDelete: 'CASCADE' })
  member!: Member;
}
