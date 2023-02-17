import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { MemberRepository } from '../../member/repository/member.repository';
import { OauthFactory } from '../application/oauth.factory';
import { SocialType } from '../../member/domain/social-type.enum';
import { MockMemberRepository } from './mock-member.repository';
import { MockOauthFactory } from './mock-oauth.factory';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { JwtService } from '@nestjs/jwt';
import { MockJwtService } from './mock-jwt.service';

describe('AuthService', () => {
  let service: AuthService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: OauthFactory,
          useClass: MockOauthFactory,
        },
        {
          provide: MemberRepository,
          useClass: MockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * jwt 토큰 구현 전 테스트
   */
  // it('로그인을 하면 사용자 정보가 반환된다.', async () => {
  //   const member = await service.signIn(SocialType.GITHUB, 'code');
  //   expect(member).toEqual({
  //     id: 1,
  //     name: 'test',
  //     socialType: SocialType.GITHUB,
  //     socialId: '1',
  //     profileImageUrl: null,
  //   });
  // });

  it('올바른 코드로 로그인에 성공하면, 토큰을 반환한다.', async () => {
    const token = await service.login(SocialType.GITHUB, 'validToken');
    expect(token).not.toBeNull();
  });

  it('올바르지 않은 코드를 입력하면 에러가 발생한다.', async () => {
    await expect(async () => {
      await service.login(SocialType.GITHUB, 'invalidToken');
    }).rejects.toThrow(RuntimeException);
  });

  it('로그아웃을 요청하면 refreshToken 의 값을 제거한다.', async () => {
    const member = await memberRepository.findOne();
    member.setRefreshToken('refreshToken');

    await service.logout(member);

    expect(member.refreshToken).toBeNull();
  });
});
