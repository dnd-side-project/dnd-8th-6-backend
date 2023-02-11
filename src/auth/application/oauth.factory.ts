import { Injectable } from '@nestjs/common';
import { SocialType } from '../../member/domain/social-type.enum';
import { OauthClient } from './oauth.client';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { KakaoOauthClient } from './kakao-oauth.client';
import { GithubOauthClient } from './github-oauth.client';

@Injectable()
export class OauthFactory {
  constructor(
    private readonly kakaoOauthClient: KakaoOauthClient,
    private readonly githubOauthClient: GithubOauthClient,
  ) {}
  getClient(socialType: SocialType): OauthClient {
    if (socialType === SocialType.KAKAO) {
      return this.kakaoOauthClient;
    }
    if (socialType === SocialType.GITHUB) {
      return this.githubOauthClient;
    }
    throw new RuntimeException('정의되지 않은 SocialType');
  }
}
