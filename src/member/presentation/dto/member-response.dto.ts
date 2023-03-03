import { SocialType } from '../../domain/social-type.enum';
import { Member } from '../../domain/member.entity';
import { MemberGrade } from '../../domain/member-grade.enum';
import { ApiProperty } from '@nestjs/swagger';

export class MemberResponseDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly socialType: SocialType;

  @ApiProperty()
  readonly profileImageUrl: string;

  @ApiProperty()
  readonly githubId: string;
  @ApiProperty()
  readonly stared?: boolean;
  @ApiProperty()
  readonly grade?: MemberGrade;
  @ApiProperty()
  readonly score?: number;
  @ApiProperty()
  readonly exp?: number;

  constructor(
    member: Member,
    stared?: boolean,
    grade?: MemberGrade,
    score?: number,
    exp?: number,
  ) {
    this.id = member.id;
    this.name = member.name;
    this.socialType = member.socialType;
    this.profileImageUrl = member.profileImageUrl;
    this.githubId = member.githubId;
    this.stared = stared;
    this.grade = grade;
    this.score = score;
    this.exp = exp;
  }
}
