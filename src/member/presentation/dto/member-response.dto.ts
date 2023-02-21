import { SocialType } from '../../domain/social-type.enum';
import { Member } from '../../domain/member.entity';

export class MemberResponseDto {
  id: number;

  name: string;

  socialType: SocialType;

  profileImageUrl: string;

  githubId: string;

  constructor(member: Member) {
    this.id = member.id;
    this.name = member.name;
    this.socialType = member.socialType;
    this.profileImageUrl = member.profileImageUrl;
    this.githubId = member.githubId;
  }
}
