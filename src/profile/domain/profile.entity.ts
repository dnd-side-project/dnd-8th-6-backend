import { Member } from 'src/member/domain/member.entity';
import { BaseEntity, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Member, (member) => member.id)
  member!: Member;
}
