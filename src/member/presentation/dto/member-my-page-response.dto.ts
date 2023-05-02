import { ApiProperty } from '@nestjs/swagger';
import { SocialType } from '../../domain/social-type.enum';
import { MemberGrade } from '../../domain/member-grade.enum';
import { MemberGithubResponseDto } from './member-github-response.dto';
import { BlogResponseDto } from './blog-response.dto';
import { Member } from '../../domain/member.entity';
import { GradeDto } from '../../application/dto/grade.dto';
import { ProfileResponseDto } from './profile-response.dto';
import { StarSummaryResponseDto } from './star-summary-response.dto';

export class MemberMyPageResponseDto {
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
  readonly grade: MemberGrade;

  @ApiProperty()
  readonly score: number;

  @ApiProperty()
  readonly exp: number;

  @ApiProperty()
  readonly profile: ProfileResponseDto;

  @ApiProperty()
  readonly star: StarSummaryResponseDto;

  @ApiProperty()
  readonly githubStat?: MemberGithubResponseDto;

  @ApiProperty()
  readonly blogStat?: BlogResponseDto;

  constructor(
    member: Member,
    grade: GradeDto,
    profile: ProfileResponseDto,
    star: StarSummaryResponseDto,
    githubStat?: MemberGithubResponseDto,
    blogStat?: BlogResponseDto,
  ) {
    this.id = member.id;
    this.name = member.name;
    this.socialType = member.socialType;
    this.profileImageUrl = member.profileImageUrl;
    this.githubId = member.githubId;
    this.grade = grade.grade;
    this.score = grade.score;
    this.exp = grade.exp;
    this.profile = profile;
    this.star = star;
    this.githubStat = githubStat;
    this.blogStat = blogStat;
  }
}