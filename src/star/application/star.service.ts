import { Injectable } from '@nestjs/common';
import { StarRepository } from '../repository/star.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../../member/repository/member.repository';
import { StarResponseDto } from '../presentation/dto/star-response.dto';

@Injectable()
export class StarService {
  constructor(
    @InjectRepository(StarRepository)
    private readonly starRepository: StarRepository,
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
  ) {}

  public async getStarList(memberId: number) {
    const member = await this.memberRepository.findOneOrThrow(memberId);

    const follows = await this.starRepository.find({
      where: {
        memberId: member,
      },
    });

    const followers = await this.starRepository.find({
      where: {
        followingId: member,
      },
    });

    return new StarResponseDto(
      memberId,
      follows.map((star) => star.followingId.id),
      followers.map((star) => star.memberId.id),
    );
  }
}
