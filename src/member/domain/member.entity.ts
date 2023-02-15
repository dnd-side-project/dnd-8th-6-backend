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

  @Column({
    nullable: true,
  })
  refreshToken: string;

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
