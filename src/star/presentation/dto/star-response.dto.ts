export class StarResponseDto {
  readonly memberId: number;
  readonly followCount: number;
  readonly follow: number[];
  readonly followerCount: number;

  readonly follower: number[];

  constructor(memberId: number, follow: number[], follower: number[]) {
    this.memberId = memberId;
    this.follow = follow;
    this.follower = follower;
    this.followCount = follow.length;
    this.followerCount = follower.length;
  }
}
