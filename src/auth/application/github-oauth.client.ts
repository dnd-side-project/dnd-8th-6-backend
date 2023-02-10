import { OauthClient } from './oauth.client';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { SocialInfoDto } from './dto/social-info.dto';
import { SocialType } from '../../member/domain/social-type.enum';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubOauthClient implements OauthClient {
  private REQUEST_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  private REQUEST_USER_INFO_URL = 'https://api.github.com/user';

  private CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  private SECRET_KEY = process.env.GITHUB_SECRET_KEY;

  constructor(private readonly httpService: HttpService) {}

  async getAccessToken(code: string): Promise<string> {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.CLIENT_ID,
      accept: 'json',
      client_secret: this.SECRET_KEY,
      code: code,
    };

    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Accept: 'application/json',
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
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get(this.REQUEST_USER_INFO_URL, header),
    );

    const socialId = response.data.id;
    const name = response.data.name;
    const profileImageUrl = response.data.avatar_url;

    return new SocialInfoDto(
      name,
      profileImageUrl,
      socialId,
      SocialType.GITHUB,
    );
  }
}
