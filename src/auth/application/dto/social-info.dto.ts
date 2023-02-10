import { SocialType } from '../../../member/domain/social-type.enum';

export class SocialInfoDto {
  name: string;
  profileImageUrl: string | null;
  socialId: string;
  socialType: SocialType;

  constructor(
    name: string,
    profileImageUrl: string | null,
    socialId: string,
    socialType: SocialType,
  ) {
    this.name = name;
    this.profileImageUrl = profileImageUrl;
    this.socialId = socialId;
    this.socialType = socialType;
  }
}
