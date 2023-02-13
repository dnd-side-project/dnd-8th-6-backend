import { CommitLog } from 'src/commit-log/domain/commit-log.entity';
import { Star } from 'src/star/domain/star.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocialType } from './social-type.enum';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'name', nullable: false, length: 20 })
  name!: string;

  @Column({ type: 'enum', name: 'social_type', nullable: false, enum: SocialType})
  socialType!: SocialType;

  @Column({ type: 'varchar', name: 'social_id', nullable: false, length: 32 })
  socialId!: string;

  @Column({ type: 'varchar', name: 'profile_image_url', nullable: true, length: 2084 })
  profileImageUrl: string;

  @OneToMany(() => CommitLog, (commitLog) => commitLog.githubId)
  @Column({ type: 'varchar', name: 'github_id',  nullable: true, unique: true })
  githubId: string;

  @OneToMany(() => Star, (star) => star.member)
  star!: Star[];

  @OneToMany(() => Star, (star) => star.followingId)
  follow!: Star[];
}
