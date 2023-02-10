import { Injectable } from '@nestjs/common';
import { SocialInfoDto } from './dto/social-info.dto';
import { SocialType } from '../../member/domain/social-type.enum';
import { OauthClient } from './oauth.client';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Injectable()
export class OauthFactory {
  getClient(socialType: SocialType): OauthClient {
    throw new RuntimeException('정의되지 않은 SocialType');
  }
}
