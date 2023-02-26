import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocialType } from './social-type.enum';
import { LogData } from '../../log-data/domain/log-data.entity';
import { Star } from '../../star/domain/star.entity';
import { Profile } from './profile.entity';
import { Blog } from './blog.entity';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'name', nullable: false, length: 20 })
  name!: string;

  @Column({
    type: 'enum',
    name: 'social_type',
    nullable: false,
    enum: SocialType,
  })
  socialType!: SocialType;

  @Column({ type: 'varchar', name: 'social_id', nullable: false, length: 32 })
  socialId!: string;

  @Column({
    type: 'varchar',
    name: 'profile_image_url',
    nullable: true,
    length: 2084,
  })
  profileImageUrl: string;

  @Column({ type: 'varchar', name: 'github_id', nullable: true, unique: true })
  githubId: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @OneToMany(() => LogData, (logData) => logData.MemberId)
  logData!: LogData[];

  @OneToMany(() => Star, (star) => star.memberId)
  star!: Star[];

  @OneToMany(() => Star, (star) => star.followingId)
  follow!: Star[];

  @OneToOne(() => Profile, (profile) => profile.member)
  profile: Profile;

  @OneToOne(() => Blog, (blog) => blog.member)
  blog!: Blog;

  // TODO 테스트를 위한 생성자로 추후 제거할 수 있는 방법 모색
  constructor(
    id: number,
    name: string,
    socialType: SocialType,
    socialId: string,
    profileImageUrl: string,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.socialType = socialType;
    this.socialId = socialId;
    this.profileImageUrl = profileImageUrl;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }
}
