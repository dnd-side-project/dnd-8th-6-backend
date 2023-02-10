import { SocialInfoDto } from './dto/social-info.dto';

export interface OauthClient {
  getAccessCode(code: string): Promise<string>;
  getSocialInfo(accessToken: string): Promise<SocialInfoDto>;
}
