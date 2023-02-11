import { OauthClient } from './oauth.client';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { HttpService } from '@nestjs/axios';
import { SocialInfoDto } from './dto/social-info.dto';
import { firstValueFrom } from 'rxjs';
import { SocialType } from '../../member/domain/social-type.enum';

@Injectable()
export class KakaoOauthClient implements OauthClient {
  private REQUEST_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private REQUEST_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

  private APP_KEY = process.env.KAKAO_APP_KEY;
  private REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;
  private CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

  constructor(private readonly httpService: HttpService) {}

  async getAccessToken(code: string): Promise<string> {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.APP_KEY,
      redirect_url: this.REDIRECT_URL,
      client_secret: this.CLIENT_SECRET,
      code: code,
    };

    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    const response = await firstValueFrom(
      this.httpService.post(this.REQUEST_TOKEN_URL, body, header),
    );

    return response.data.access_token;
  }

  async getSocialInfo(accessToken: string): Promise<SocialInfoDto> {
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get(this.REQUEST_USER_INFO_URL, header),
    );

    const socialId = response.data.id;
    const name = response.data.kakao_account.profile.nickname;
    const profileImageUrl =
      response.data.kakao_account.profile.profile_image_url;

    return new SocialInfoDto(name, profileImageUrl, socialId, SocialType.KAKAO);
  }
}
