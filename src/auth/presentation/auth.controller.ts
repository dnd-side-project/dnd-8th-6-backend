import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SocialType } from '../../member/domain/social-type.enum';
import { Member } from '../../member/domain/member.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao/login')
  async kakaoLogin(@Query('code') code: string): Promise<Member> {
    return await this.authService.signIn(SocialType.KAKAO, code);
  }
}
