import { SocialType } from '../../domain/social-type.enum';
import { Member } from '../../domain/member.entity';
import { MemberGrade } from '../../domain/member-grade.enum';

export class MemberResponseDto {
  readonly id: number;

  readonly name: string;

  readonly socialType: SocialType;

  readonly profileImageUrl: string;

  readonly githubId: string;
  readonly stared?: boolean;
  readonly grade?: MemberGrade;

  constructor(member: Member, stared?: boolean, grade?: MemberGrade) {
    this.id = member.id;
    this.name = member.name;
    this.socialType = member.socialType;
    this.profileImageUrl = member.profileImageUrl;
    this.githubId = member.githubId;
    this.stared = stared;
    this.grade = grade;
  }
}
