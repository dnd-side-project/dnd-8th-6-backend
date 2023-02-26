import { SocialType } from '../../domain/social-type.enum';
import { Member } from '../../domain/member.entity';

export class MemberResponseDto {
  readonly id: number;

  readonly name: string;

  readonly socialType: SocialType;

  readonly profileImageUrl: string;

  readonly githubId: string;

  constructor(member: Member) {
    this.id = member.id;
    this.name = member.name;
    this.socialType = member.socialType;
    this.profileImageUrl = member.profileImageUrl;
    this.githubId = member.githubId;
  }
}
