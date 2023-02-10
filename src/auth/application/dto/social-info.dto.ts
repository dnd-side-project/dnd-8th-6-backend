import { SocialType } from '../../../member/domain/social-type.enum';

export class SocialInfoDto {
  name: string;
  profileImageUrl: string | null;
  socialId: number;
  socialType: SocialType;
}
