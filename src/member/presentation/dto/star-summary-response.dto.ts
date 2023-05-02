import { ApiProperty } from '@nestjs/swagger';
import { MemberMainPageResponseDto } from './member-main-page-response.dto';

export class StarSummaryResponseDto {
  @ApiProperty()
  readonly followCount: number;
  @ApiProperty()
  readonly follow: MemberMainPageResponseDto[];
  @ApiProperty()
  readonly followerCount: number;

  @ApiProperty()
  readonly follower: MemberMainPageResponseDto[];

  constructor(
    follow: MemberMainPageResponseDto[],
    follower: MemberMainPageResponseDto[],
  ) {
    this.follow = follow;
    this.follower = follower;
    this.followCount = follow.length;
    this.followerCount = follower.length;
  }
}
