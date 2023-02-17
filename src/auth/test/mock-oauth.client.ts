import { SocialInfoDto } from '../application/dto/social-info.dto';
import { SocialType } from '../../member/domain/social-type.enum';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

export class MockOauthClient {
  getAccessToken(code: string) {
    if (code === 'invalidToken') {
      throw new RuntimeException('invalidToken');
    }
    return 'accessToken';
  }

  getSocialInfo() {
    return new SocialInfoDto('test', null, '1', SocialType.GITHUB);
  }
}
