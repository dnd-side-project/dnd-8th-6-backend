import { Member } from '../domain/member.entity';
import { SocialType } from '../domain/social-type.enum';
import { BadRequestException } from '@nestjs/common';

export class MockMemberRepository {
  members = [];

  /**
   * init 의 용도로 사용
   */
  public clear() {
    const member1 = new Member(1, 'member', SocialType.GITHUB, '1', null);
    const member2 = new Member(3, 'member', SocialType.GITHUB, '1', null);
    member2.setRefreshToken('refreshToken');
    const member3 = new Member(4, 'member', SocialType.GITHUB, '1', null);

    this.members.push(member1, member2, member3);
  }

  public async findOneOrThrow(id: number) {
    const member = this.members.find((member) => member.id === id);

    if (!member) throw new BadRequestException();

    return member;
  }

  public async delete(member: Member) {
    this.members = this.members.filter((m) => member !== m);
  }

  public async getMemberListByNameOrGithubIdLike(name: string) {
    return this.members.filter(
      (member) => member.name.includes(name) || member.githubId.includes(name),
    );
  }

  public async save(updateValue: Member) {
    const member = this.members.find((member) => member.id === updateValue.id);
    member.githubId = updateValue.githubId;
    member.name = updateValue.name;
  }
}
