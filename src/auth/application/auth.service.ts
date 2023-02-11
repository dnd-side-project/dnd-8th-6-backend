import { Injectable } from '@nestjs/common';
import { OauthFactory } from './oauth.factory';
import { SocialType } from '../../member/domain/social-type.enum';
import { MemberRepository } from '../../member/repository/member.repository';
import { SocialInfoDto } from './dto/social-info.dto';
import { Member } from '../../member/domain/member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    private readonly oauthFactory: OauthFactory,
  ) {}

  public async signIn(socialType: SocialType, code: string): Promise<Member> {
    const oauthClient = this.oauthFactory.getClient(socialType);

    const accessToken = await oauthClient.getAccessToken(code);
    const socialInfo = await oauthClient.getSocialInfo(accessToken);

    const member = await this.memberRepository.findOne({
      socialId: socialInfo.socialId,
      socialType: socialInfo.socialType,
    });

    if (member) {
      return member;
    }

    return await this.signUp(socialInfo);
  }

  private async signUp(socialInfo: SocialInfoDto): Promise<Member> {
    const member = await this.memberRepository.create({
      name: socialInfo.name,
      socialId: socialInfo.socialId,
      socialType: socialInfo.socialType,
      profileImageUrl: socialInfo.profileImageUrl,
    });

    return await this.memberRepository.save(member);
  }
}
