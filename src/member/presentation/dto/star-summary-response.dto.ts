import { ApiProperty } from '@nestjs/swagger';
import { MemberSummaryResponseDto } from './member-summary-response.dto';

export class StarSummaryResponseDto {
  @ApiProperty()
  readonly followCount: number;
  @ApiProperty()
  readonly follow: MemberSummaryResponseDto[];
  @ApiProperty()
  readonly followerCount: number;

  @ApiProperty()
  readonly follower: MemberSummaryResponseDto[];

  constructor(
    follow: MemberSummaryResponseDto[],
    follower: MemberSummaryResponseDto[],
  ) {
    this.follow = follow;
    this.follower = follower;
    this.followCount = follow.length;
    this.followerCount = follower.length;
  }
}
