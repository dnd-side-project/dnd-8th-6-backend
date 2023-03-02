import { BadRequestException, Injectable } from '@nestjs/common';
import { StarRepository } from '../repository/star.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../../member/repository/member.repository';
import { Member } from '../../member/domain/member.entity';
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
      relations: ['memberId', 'followingId'],
    });

    const followers = await this.starRepository.find({
      where: {
        followingId: member,
      },
      relations: ['memberId', 'followingId'],
    });

    return new StarResponseDto(
      memberId,
      follows.map((star) => star.followingId.id),
      followers.map((star) => star.memberId.id),
    );
  }

  public async followMember(
    member: Member,
    followTargetId: number,
  ): Promise<StarResponseDto> {
    this.validateFollowInfo(member, followTargetId);

    const targetMember = await this.memberRepository.findOneOrThrow(
      followTargetId,
    );

    const star = await this.starRepository.findOne({
      where: {
        memberId: member,
        followingId: targetMember,
      },
    });

    if (star) {
      throw new BadRequestException('이미 팔로우된 사용자입니다.');
    }

    const newStar = await this.starRepository.create({
      memberId: member,
      followingId: targetMember,
    });

    await this.starRepository.save(newStar);

    return this.getStarList(member.id);
  }

  public async unfollowMember(
    member: Member,
    unfollowTargetId: number,
  ): Promise<StarResponseDto> {
    this.validateFollowInfo(member, unfollowTargetId);

    const targetMember = await this.memberRepository.findOneOrThrow(
      unfollowTargetId,
    );

    const star = await this.starRepository.findOne({
      where: {
        memberId: member,
        followingId: targetMember,
      },
    });

    if (!star) {
      throw new BadRequestException('팔로우 하지 않은 사용자입니다.');
    }

    await this.starRepository.delete(star);

    return this.getStarList(member.id);
  }

  private validateFollowInfo(member: Member, followTargetId: number) {
    if (member.id === followTargetId) {
      throw new BadRequestException('자신을 팔로우 할 수 없습니다.');
    }
  }
}
