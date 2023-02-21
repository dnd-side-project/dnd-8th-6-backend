import { EntityRepository, Repository } from 'typeorm';
import { Member } from '../domain/member.entity';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(Member)
export class MemberRepository extends Repository<Member> {
  public async findOneOrThrow(id: number) {
    const member = await this.findOne(id);

    if (!member) {
      throw new BadRequestException('존재하지 않는 사용자 입니다.');
    }

    return member;
  }
  public async getMemberListByNameOrGithubIdLike(
    name: string,
  ): Promise<Member[]> {
    return await this.createQueryBuilder('member')
      .where('member.name LIKE :name', { name: `%${name}%` })
      .orWhere('member.githubId LIKE :name', { name: `%${name}%` })
      .orderBy('member.name', 'ASC')
      .getMany();
  }
}
