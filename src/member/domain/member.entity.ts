import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocialType } from './social-type.enum';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column()
  socialType!: SocialType;

  @Column()
  socialId!: string;

  @Column({
    nullable: true,
  })
  profileImageUrl: string;
}
