import { Member } from '../../member/domain/member.entity';
import { SocialType } from '../../member/domain/social-type.enum';

export class MockMemberRepository {
  findOne(): Member {
    return new Member(1, 'test', SocialType.GITHUB, '1', null);
  }

  save() {
    return new Member(1, 'test', SocialType.GITHUB, '1', null);
  }
}
