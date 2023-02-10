import { Injectable } from '@nestjs/common';
import { SocialType } from '../../member/domain/social-type.enum';
import { OauthClient } from './oauth.client';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { KakaoOauthClient } from './kakao-oauth.client';

@Injectable()
export class OauthFactory {
  constructor(private readonly kakaoOauthClient: KakaoOauthClient) {}
  getClient(socialType: SocialType): OauthClient {
    if (socialType === SocialType.KAKAO) {
      return this.kakaoOauthClient;
    }
    throw new RuntimeException('정의되지 않은 SocialType');
  }
}
