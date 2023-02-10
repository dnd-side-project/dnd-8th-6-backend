import { SocialInfoDto } from './dto/social-info.dto';

export interface OauthClient {
  getAccessToken(code: string): Promise<string>;
  getSocialInfo(accessToken: string): Promise<SocialInfoDto>;
}
