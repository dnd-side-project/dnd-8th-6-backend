import { SocialInfoDto } from '../application/dto/social-info.dto';
import { SocialType } from '../../member/domain/social-type.enum';

export class MockOauthClient {
  getAccessToken() {
    return 'accessToken';
  }

  getSocialInfo() {
    return new SocialInfoDto('test', null, '1', SocialType.GITHUB);
  }
}
